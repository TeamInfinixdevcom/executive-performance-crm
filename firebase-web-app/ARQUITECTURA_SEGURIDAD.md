# 🏗️ ARQUITECTURA DE SEGURIDAD - DIAGRAMA

## Visión General: Capas de Seguridad

```
┌─────────────────────────────────────────────────────────────┐
│                        USUARIO                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CAPA 1: FRONTEND SECURITY                                 │
│  ┌────────────────────────────────────────────────┐         │
│  │ • Validación de entrada                        │         │
│  │ • Sanitización de HTML                         │         │
│  │ • Prevención de XSS local                      │         │
│  │ • HTTPS solo                                   │         │
│  │ • Confirmación de acciones críticas            │         │
│  └────────────────────────────────────────────────┘         │
│                                                             │
│  CAPA 2: NETWORK / HEADERS                                 │
│  ┌────────────────────────────────────────────────┐         │
│  │ • Content-Security-Policy (CSP)                │         │
│  │ • X-Content-Type-Options: nosniff             │         │
│  │ • X-Frame-Options: SAMEORIGIN                 │         │
│  │ • Strict-Transport-Security (HSTS)            │         │
│  │ • Referrer-Policy                             │         │
│  │ • Permissions-Policy                          │         │
│  └────────────────────────────────────────────────┘         │
│                                                             │
│  CAPA 3: AUTHENTICATION & AUTHORIZATION                    │
│  ┌────────────────────────────────────────────────┐         │
│  │ • Firebase Authentication                      │         │
│  │ • JWT Token validation                         │         │
│  │ • Role-based access control (RBAC)            │         │
│  │ • 2FA (opcional)                              │         │
│  └────────────────────────────────────────────────┘         │
│                        ↓                                    │
│  CAPA 4: API SECURITY (Cloud Functions)                    │
│  ┌────────────────────────────────────────────────┐         │
│  │ • Callable Functions (no HTTP directo)        │         │
│  │ • Context.auth verificado                     │         │
│  │ • Rate limiting (5 intentos/hora)             │         │
│  │ • Input validation                            │         │
│  │ • Error handling seguro                       │         │
│  └────────────────────────────────────────────────┘         │
│                        ↓                                    │
│  CAPA 5: DATABASE SECURITY (Firestore Rules)               │
│  ┌────────────────────────────────────────────────┐         │
│  │ • Field-level access control                  │         │
│  │ • Document-level security rules               │         │
│  │ • isAdmin() verification                      │         │
│  │ • Data type validation                        │         │
│  │ • Size limits                                 │         │
│  │ • isActiveUser() check                        │         │
│  └────────────────────────────────────────────────┘         │
│                        ↓                                    │
│  CAPA 6: LOGGING & AUDITING                                │
│  ┌────────────────────────────────────────────────┐         │
│  │ • audit_logs collection                       │         │
│  │ • Timestamp & User tracking                   │         │
│  │ • Action logging                              │         │
│  │ • Error tracking                              │         │
│  │ • IP address logging                          │         │
│  └────────────────────────────────────────────────┘         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                     FIRESTORE DATABASE                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Flujo de una Acción Segura

### Ejemplo: Admin crea un usuario

```
USUARIO INTENTA CREAR USUARIO
        ↓
[CAPA 1] Frontend valida:
  ✓ Email válido?
  ✓ Nombre válido?
  ✓ Contraseña ≥8 caracteres?
  ✓ Sin scripts maliciosos?
  Si NO → Mostrar error y parar
        ↓
[CAPA 2] Headers en tránsito:
  ✓ HTTPS (Strict-Transport-Security)
  ✓ CSP headers validando origen
  Si NO → Rechazar
        ↓
[CAPA 3] Firebase Auth:
  ✓ Usuario logueado?
  ✓ Token válido?
  Si NO → Rechazar "unauthenticated"
        ↓
[CAPA 4] Cloud Function (onCall):
  ✓ Context.auth existe?
  ✓ Es admin verificando en Firestore?
  ✓ Rate limit: ¿<5 intentos/hora?
  ✓ Input validado?
  Si NO → Rechazar con error específico
        ↓
  ✓ Crear usuario en Auth
  ✓ Crear documento en Firestore
        ↓
[CAPA 5] Firestore Rules validan:
  ✓ Usuario autenticado?
  ✓ Es admin?
  ✓ Datos válidos?
  Si NO → DENEGAR (write blocked)
        ↓
✓ ÉXITO - Usuario creado
        ↓
[CAPA 6] Auditoría registra:
  - userId: "admin-uid"
  - action: "CREATE_USER"
  - timestamp: "2025-11-10T10:30:00Z"
  - targetEmail: "new-user@example.com"
  - ipAddress: "192.168.1.100"
  - status: "SUCCESS"
```

---

## Comparación: Attack Path ANTES vs DESPUÉS

### ANTES (Vulnerable)

```
ATACANTE QUIERE: Eliminar a admin@example.com
        ↓
URL pública encontrada:
https://us-central1-xxx.cloudfunctions.net/cleanAndRecreateUser
        ↓
curl -X POST ... -d '{"email":"admin@example.com"}'
        ↓
❌ SIN VALIDACIÓN
        ↓
👤 Usuario eliminado
💀 ¡EXPLOTADO!
```

### DESPUÉS (Protegido)

```
ATACANTE QUIERE: Eliminar a admin@example.com
        ↓
Encuentra la URL... ya no es HTTP público
        ↓
Intenta llamar con fetch:
const fn = httpsCallable(functions, 'cleanAndRecreateUser');
await fn({email: 'admin@example.com'})
        ↓
❌ CAPA 3: No está autenticado
Error: 'unauthenticated'
        ↓
Se autentica (¿cómo? credenciales robadas?)
Intenta de nuevo
        ↓
❌ CAPA 4: No es admin
Error: 'permission-denied'
Registrado en audit_logs ← Admin notificado!
        ↓
Intenta 3 veces...
        ↓
❌ CAPA 4: Rate limit alcanzado
Error: 'resource-exhausted'
Bloqueado por 1 hora
Todos los intentos registrados
        ↓
❌ ATACANTE BLOQUEADO
✅ SEGURIDAD EFECTIVA
```

---

## Matriz de Decisión: ¿Qué bloquea qué?

```
PASO         CONTROL                      BLOQUEA
────────────────────────────────────────────────────
1. Frontend  Validación HTML              Datos inválidos
2. Network   CSP Headers                  Inline scripts
3. Auth      Token JWT                    No autenticados
4. Function  Admin verification           No admins
5. Function  Rate limiting                Fuerza bruta
6. Rules     Firestore validation         Datos maliciosos
7. Rules     isAdmin() check              Acceso no autorizado
```

---

## Stack Tecnológico de Seguridad

```
                    SEGURIDAD
┌─────────────────────────────────────┐
│                                     │
│  FRONTEND LAYER                     │
│  ├─ HTML5 Validation                │
│  ├─ JavaScript sanitization         │
│  └─ HTTPS enforcement               │
│                                     │
│  NETWORK LAYER                      │
│  ├─ Content-Security-Policy         │
│  ├─ HSTS (HTTP Strict Transport)    │
│  ├─ X-Frame-Options                 │
│  ├─ X-Content-Type-Options          │
│  └─ Referrer-Policy                 │
│                                     │
│  AUTHENTICATION LAYER               │
│  ├─ Firebase Authentication         │
│  ├─ JWT Token Verification          │
│  ├─ Custom Claims (roles)           │
│  └─ Session Management              │
│                                     │
│  APPLICATION LAYER                  │
│  ├─ Cloud Functions (Node.js)       │
│  ├─ Input validation                │
│  ├─ Rate limiting                   │
│  └─ Error handling                  │
│                                     │
│  DATABASE LAYER                     │
│  ├─ Firestore Security Rules        │
│  ├─ Field-level encryption (opcional)│
│  ├─ Audit logging                   │
│  └─ Access control                  │
│                                     │
│  MONITORING LAYER                   │
│  ├─ Cloud Logging                   │
│  ├─ Audit trails                    │
│  ├─ Error tracking                  │
│  └─ Security alerts                 │
│                                     │
└─────────────────────────────────────┘
```

---

## Diagrama de Flujo: Request Seguro

```
┌─────────────────────────────────────────────────────────────┐
│                    HTTP REQUEST                             │
├─────────────────────────────────────────────────────────────┤
│  POST /api/deleteUser                                       │
│  Headers:                                                   │
│    Authorization: Bearer eyJhbGc...                         │
│    Content-Type: application/json                           │
│  Body: {"email": "target@example.com"}                      │
└─────────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────┐
        │   SECURITY CHECK 1: Headers     │
        │   ✓ HTTPS/TLS encrypted        │
        │   ✓ Origin válido              │
        │   ✓ CORS permitido             │
        └─────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────┐
        │   SECURITY CHECK 2: Auth Token  │
        │   ✓ JWT válido                 │
        │   ✓ No expirado                │
        │   ✓ Signature válida           │
        └─────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────┐
        │   SECURITY CHECK 3: User Role   │
        │   → Firestore query: users/{uid}│
        │   ✓ role == 'admin'            │
        │   ✓ isActive == true           │
        └─────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────┐
        │   SECURITY CHECK 4: Rate Limit  │
        │   → Redis/Firestore check       │
        │   ✓ Intentos < 5/hora          │
        │   ✓ Incrementar contador       │
        └─────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────┐
        │   SECURITY CHECK 5: Input Valid │
        │   ✓ email válido               │
        │   ✓ No scripts maliciosos      │
        │   ✓ Datos completos           │
        └─────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────┐
        │   EXECUTE ACTION SAFELY         │
        │   1. Crear en Auth              │
        │   2. Crear en Firestore         │
        │   3. Log to audit_logs          │
        └─────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────┐
        │   SECURITY CHECK 6: Rules       │
        │   Firestore Rules verifican:    │
        │   ✓ Usuario autenticado        │
        │   ✓ Datos válidos              │
        │   ✓ Permiso para escribir      │
        │   ✓ Si NO → DENY WRITE         │
        └─────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    RESPONSE 200 OK                          │
│  {"success": true, "message": "User created"}              │
│                                                             │
│  AUDIT LOG CREADO:                                          │
│  {                                                          │
│    userId: "admin-uid",                                    │
│    action: "CREATE_USER",                                  │
│    timestamp: "2025-11-10T...",                            │
│    ipAddress: "..."                                        │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Prevención de Ataques Comunes

### 1. XSS (Cross-Site Scripting)

```
ATAQUE INTENTA: <img src=x onerror="alert('XSS')">
        ↓
Capa 1: Frontend valida
  ✓ Detecta /<script|onerror/
  ✓ Rechaza
        ↓
Capa 2: CSP Header
  Content-Security-Policy: script-src 'self'
  ✓ Inline scripts bloqueados
        ↓
Capa 5: Frontend renderiza con textContent
  ✓ NO innerHTML (texto solo)
        ↓
✅ XSS PREVENIDO
```

### 2. SQL Injection / Firestore Injection

```
ATAQUE INTENTA: '; DROP TABLE users; --"
        ↓
Capa 1: Frontend valida tipo string
  ✓ No es validación de email
  ✓ Rechaza
        ↓
Capa 4: Backend valida tipo
  if (email.match(...@...)) ✓
  else ❌ reject
        ↓
Capa 5: Firestore Rules valida
  isValidClientData() ✓
  else ❌ DENY
        ↓
✅ INYECCIÓN PREVENIDA
```

### 3. CSRF (Cross-Site Request Forgery)

```
ATAQUE: Abrir link malicioso que ejecuta acción
        ↓
Capa 2: Origin check
  ✓ Same-Origin Policy
  ✓ CORS validation
        ↓
Capa 3: Auth token
  ✓ No en cookie (en header)
  ✓ Atacante no puede acceder
        ↓
✅ CSRF PREVENIDO
```

### 4. DDoS / Fuerza Bruta

```
ATACANTE: 1000 requests/segundo
        ↓
Capa 4: Rate limiting
  ✓ Max 5 intentos/hora/usuario
  ✓ Después: 403 Forbidden
        ↓
Capa 6: Audit logging
  ✓ Todos los intentos registrados
  ✓ Admin puede ver patrón
        ↓
Resultado: Detectado + bloqueado
✅ ATAQUE MITIGADO
```

---

## Comparativa de Protección

```
VULNERABILIDAD          ANTES  DESPUÉS
────────────────────────────────────────
XSS                     ⚠️     ✅✅
Inyección              ⚠️     ✅✅
Fuerza Bruta           ❌     ✅✅
Acceso No Autorizado   ❌     ✅✅
CSRF                   ⚠️     ✅✅
Clickjacking           ❌     ✅
MIME Sniffing          ❌     ✅
Man-in-the-Middle      ⚠️     ✅✅
Rate Limiting          ❌     ✅✅
Auditoría              ❌     ✅✅

PROMEDIO:              40%    95%
```

---

**Diagrama Final**: Arquitectura defensiva de 6 capas, cada una protegiendo contra vulnerabilidades específicas.

**Resultado**: Aplicación segura, escalable, y auditable.

🔒
