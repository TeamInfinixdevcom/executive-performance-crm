# 🛡️ ESTRATEGIA DEFENSIVA DE SEGURIDAD - EXECUTIVE PERFORMANCE

**Fecha**: Noviembre 10, 2025  
**Estado**: DESPLEGADO EN PRODUCCIÓN  
**Prioridad**: CRÍTICA

---

## 📋 RESUMEN EJECUTIVO

Tu aplicación está desplegada pero tiene **vulnerabilidades críticas** que deben corregirse sin afectar usuarios. Esta estrategia separa las acciones por **URGENTES**, **IMPORTANTES** e **INMEDIATAS**.

### Riesgo de Seguridad Actual: 🔴 ALTO
- Credenciales Firebase expuestas en frontend (NORMAL en Firebase)
- Cloud Functions sin autenticación
- Firestore Rules incompletas
- Validación insuficiente en datos sensibles

---

## 🔴 VULNERABILIDADES CRÍTICAS ENCONTRADAS

### 1. **HTTP Functions SIN AUTENTICACIÓN** ⚠️ CRÍTICO
**Archivo**: `functions/index.js`

```javascript
// ❌ PROBLEMA: Cualquier persona puede llamar esto
exports.cleanAndRecreateUser = functions.https.onRequest(async (req, res) => {
  // NO verifica que sea admin
  const { email } = req.body;
  await auth.deleteUser(userRecord.uid); // ¡PELIGROSO!
});

exports.syncAuthToFirestore = functions.https.onRequest(async (req, res) => {
  // Sin verificación de autenticación
});
```

**Impacto**: Cualquier persona con la URL puede:
- ✅ Eliminar usuarios
- ✅ Sincronizar datos sin autorización
- ✅ Ejecutar operaciones admin

**Solución**: Convertir a `onCall()` con validación de admin

---

### 2. **Firestore Rules Incompletas** ⚠️ CRÍTICO

```javascript
// ❌ PROBLEMA: No verifica isAdmin correctamente
function isAdmin() {
  return isSignedIn() && 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
// Esto puede fallar si el documento no existe = ACCESO ABIERTO

// ❌ PROBLEMA: Crear sin validación
match /clients/{clientId} {
  allow create: if isSignedIn() && isActiveUser() && 
                   request.resource.data.executiveId == request.auth.uid;
  // ¿Y si alguien envía datos maliciosos?
}
```

**Impacto**: Acceso no autorizado a datos de otros usuarios

**Solución**: Agregar validaciones y manejo de errores

---

### 3. **Credenciales Firebase Expuestas en HTML** ⚠️ MEDIA
**Archivo**: `public/index.html`, `public/js/firebase-config.js`

```html
<!-- ❌ PROBLEMA: Credenciales visibles en el HTML -->
<script>
const firebaseConfig = {
    apiKey: "AIzaSyB_QB5AOMTRUF1tPF0ypMYwlI2F16Ugy0w",
    authDomain: "executiveperformancek.firebaseapp.com",
    projectId: "executiveperformancek",
    ...
};
</script>
```

**Nota**: Esto es NORMAL en Firebase, pero puede ser explotado.

**Solución**: Limitar API Key en Firebase Console

---

### 4. **Admin Panel SIN Validación Suficiente** ⚠️ MEDIA
**Archivo**: `public/js/admin-panel.js`

```javascript
// Verifica que sea admin, pero solo en frontend
// Si interceptan la request, pueden crear usuarios como admins
```

**Solución**: Validar en Cloud Functions, no solo en frontend

---

### 5. **Datos Sensibles en LocalStorage** ⚠️ BAJA
```javascript
// Posibles exposiciones de tokens y datos sensibles
localStorage.setItem('userData', JSON.stringify(userData));
```

**Solución**: Solo guardar lo mínimo necesario

---

## ✅ PLAN DE ACCIÓN (Implementación Segura)

### **FASE 1: INMEDIATA (Hoy - Crítico)**

#### 1.1 Proteger Cloud Functions
**Cambiar HTTP Functions a Callable Functions con autenticación**

```javascript
// ✅ SEGURO: Usar onCall() con verificación de admin
exports.cleanAndRecreateUser = functions.https.onCall(async (data, context) => {
  // Verificar que está autenticado
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated', 
      'El usuario debe estar autenticado'
    );
  }

  // Verificar que es admin
  const userDoc = await admin.firestore()
    .collection('users')
    .doc(context.auth.uid)
    .get();

  if (!userDoc.exists() || userDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Solo administradores pueden ejecutar esta acción'
    );
  }

  // Ahora sí, ejecutar operación sensible
  const { email } = data;
  const userRecord = await admin.auth().getUserByEmail(email);
  await admin.firestore().collection('users').doc(userRecord.uid).delete();
  await admin.auth().deleteUser(userRecord.uid);

  return { success: true, message: `Usuario ${email} eliminado` };
});
```

#### 1.2 Actualizar Firestore Rules
```javascript
// ✅ SEGURO: Verificar isAdmin con try-catch
function isAdmin() {
  let role = '';
  try {
    role = get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
  } catch (e) {
    return false; // Si no existe, no es admin
  }
  return isSignedIn() && role == 'admin';
}

// ✅ VALIDACIONES ADICIONALES
function validateClientData() {
  return request.resource.data.keys().hasAll(['name', 'email', 'executiveId']) &&
         request.resource.data.executiveId == request.auth.uid &&
         request.resource.data.name is string &&
         request.resource.data.name.size() > 0;
}

// Aplicar en rules
match /clients/{clientId} {
  allow create: if isSignedIn() && isActiveUser() && validateClientData();
}
```

#### 1.3 Implementar rate limiting
```javascript
// Prevenir ataque de fuerza bruta
function isRateLimited() {
  let attempts = get(/databases/$(database)/documents/rateLimit/$(request.auth.uid)).data.attempts || 0;
  let lastAttempt = get(/databases/$(database)/documents/rateLimit/$(request.auth.uid)).data.lastAttempt || 0;
  
  return attempts > 10 && (request.time.toMillis() - lastAttempt) < 3600000; // 10 intentos por hora
}
```

---

### **FASE 2: CORTO PLAZO (Esta semana - Importante)**

#### 2.1 Restricción de API Key en Firebase
1. Ve a: **Firebase Console** → **Configuración del Proyecto** → **Claves API**
2. Edita la clave pública:
   - ✅ Restringir a **HTTP Referrers**
   - ✅ Agregar solo: `executiveperformancek.firebaseapp.com`
   - ✅ Desactivar APIs innecesarias

#### 2.2 Habilitar Google Cloud Security
1. **Cloud Logging**: Monitorear acceso a Firestore
2. **Cloud Audit Logs**: Registrar cambios en datos sensibles
3. **DDoS Protection**: Activar en Load Balancer

#### 2.3 Implementar Security Headers
**Archivo**: `firebase.json`

```json
{
  "hosting": {
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          },
          {
            "key": "Strict-Transport-Security",
            "value": "max-age=31536000; includeSubDomains"
          },
          {
            "key": "Content-Security-Policy",
            "value": "default-src 'self'; script-src 'self' https://www.gstatic.com https://www.googleapis.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com"
          }
        ]
      }
    ]
  }
}
```

#### 2.4 Validación en Frontend
```javascript
// ✅ SEGURO: Validar datos antes de enviar
function validateUserInput(data) {
  if (!data.email || !data.email.includes('@')) {
    throw new Error('Email inválido');
  }
  if (!data.name || data.name.length < 2) {
    throw new Error('Nombre muy corto');
  }
  // XSS Prevention
  if (/<script|javascript:/i.test(data.name)) {
    throw new Error('Entrada sospechosa detectada');
  }
  return true;
}
```

---

### **FASE 3: MEDIANO PLAZO (Este mes - Recomendado)**

#### 3.1 Implementar CORS
```javascript
// functions/index.js - Headers de seguridad
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://executiveperformancek.firebaseapp.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
```

#### 3.2 Encriptación de Datos Sensibles
```javascript
// Datos como passwords, números de tarjeta en Firestore
const crypto = require('crypto');

function encryptSensitiveData(data, encryptionKey) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(encryptionKey), iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}
```

#### 3.3 Auditoría de Acceso
```javascript
// Cloud Function para registrar acceso a datos sensibles
exports.auditAccess = functions.firestore
  .document('clients/{clientId}')
  .onUpdate(async (change, context) => {
    await admin.firestore().collection('audit_logs').add({
      userId: context.auth.uid,
      action: 'UPDATE',
      resource: 'clients',
      documentId: context.params.clientId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      before: change.before.data(),
      after: change.after.data()
    });
  });
```

#### 3.4 Implementar 2FA para Admin
```javascript
// Firebase Phone Verification para admins
const phoneNumber = "+57..." // Número del admin
await admin.auth().updateUser(adminUid, {
  phoneNumber: phoneNumber
});
```

---

### **FASE 4: LARGO PLAZO (2-3 meses - Mejora Continua)**

#### 4.1 Web Application Firewall (WAF)
- Integrar **CloudFlare** o **AWS WAF**
- Proteger contra: SQL Injection, XSS, DDoS

#### 4.2 Certificado SSL/TLS
- ✅ Ya tienes HTTPS con Firebase Hosting
- Renovar anualmente

#### 4.3 Pruebas de Seguridad
- Ejecutar **OWASP ZAP** monthly
- Penetration testing trimestral

#### 4.4 Backup Automático Encriptado
```javascript
// Backup diario encriptado en Cloud Storage
exports.dailyBackup = functions.pubsub.schedule('every day 02:00').onRun(async (context) => {
  const snapshot = await admin.firestore().collection('users').get();
  const backup = {
    timestamp: new Date().toISOString(),
    data: snapshot.docs.map(doc => doc.data())
  };
  
  await admin.storage()
    .bucket()
    .file(`backups/users_${Date.now()}.json`)
    .save(JSON.stringify(backup));
});
```

---

## 🚀 IMPLEMENTACIÓN PASO A PASO (Esta semana)

### Paso 1: Proteger Cloud Functions
```bash
# 1. Editar functions/index.js
# 2. Reemplazar exports.cleanAndRecreateUser y exports.syncAuthToFirestore
# 3. Cambiar de onRequest() a onCall() con validación
# 4. Deploy:
firebase deploy --only functions
```

### Paso 2: Actualizar Firestore Rules
```bash
# 1. Editar firestore.rules
# 2. Agregar validaciones de isAdmin con try-catch
# 3. Agregar validateClientData()
# 4. Deploy:
firebase deploy --only firestore:rules
```

### Paso 3: Agregar Security Headers
```bash
# 1. Editar firebase.json
# 2. Agregar headers (ver FASE 2.3)
# 3. Deploy:
firebase deploy --only hosting
```

### Paso 4: Monitorear
```bash
# Ver logs:
firebase functions:log
# Monitorear Firestore:
firebase firestore:describe
```

---

## 📊 CHECKLIST DE SEGURIDAD

### Antes de Producción
- [ ] Cloud Functions protegidas con autenticación
- [ ] Firestore Rules validadas en consola
- [ ] API Key restringida en Firebase Console
- [ ] Security Headers en firebase.json
- [ ] CORS configurado
- [ ] Rate limiting habilitado
- [ ] Logs de auditoría activos

### Cada Mes
- [ ] Revisar logs de acceso
- [ ] Actualizar dependencias
- [ ] Ejecutar OWASP ZAP
- [ ] Revisar permisos de usuarios

### Cada Trimestre
- [ ] Penetration test
- [ ] Rotación de keys
- [ ] Revisión de Firestore Rules
- [ ] Backup test

---

## 🔍 MONITOREO RECOMENDADO

```javascript
// Agregar a Cloud Functions - Alertas de seguridad
exports.securityAlert = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after = change.after.data();
    
    // Alerta si role cambió
    if (before.role !== after.role) {
      console.warn(`⚠️ ROLE CHANGE: ${before.role} -> ${after.role}`);
      // Enviar email de alerta
    }
    
    // Alerta si isActive cambió
    if (before.isActive !== after.isActive) {
      console.warn(`⚠️ USER ${after.email} DEACTIVATED`);
    }
  });
```

---

## 📞 SOPORTE Y REFERENCIA

### Documentación
- [Firebase Security Best Practices](https://firebase.google.com/docs/firestore/security/rules-structure)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Google Cloud Security](https://cloud.google.com/security)

### Herramientas
- **OWASP ZAP**: Análisis de vulnerabilidades
- **Snyk**: Escaneo de dependencias
- **SonarQube**: Análisis de código

---

## ⚠️ PRÓXIMOS PASOS INMEDIATOS

1. **HOY**: Leer esta estrategia completa
2. **MAÑANA**: Implementar Paso 1 (Cloud Functions)
3. **DÍA 3**: Implementar Paso 2 (Firestore Rules)
4. **DÍA 4**: Implementar Paso 3 (Security Headers)
5. **DÍA 5**: Pruebas completas y deployment

**Tiempo estimado**: 8-12 horas de desarrollo  
**Riesgo de downtime**: ✅ BAJO (solo reglas y headers)  
**Impacto en usuarios**: ✅ NINGUNO (mejora transparente)

---

**Versión**: 1.0  
**Última actualización**: 10 Nov 2025  
**Responsable**: Equipo de Seguridad
