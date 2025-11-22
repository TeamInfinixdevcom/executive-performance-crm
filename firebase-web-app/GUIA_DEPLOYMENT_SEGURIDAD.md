# 📋 GUÍA DE DEPLOYMENT - ESTRATEGIA DEFENSIVA

**Estado**: LISTO PARA IMPLEMENTAR  
**Riesgo de downtime**: ✅ BAJO  
**Tiempo estimado**: 30-45 minutos

---

## ⏱️ TIMELINE RECOMENDADO

| Fase | Acción | Tiempo | Riesgo |
|------|--------|--------|--------|
| 1 | Backup actual | 5 min | ✅ Bajo |
| 2 | Deploy Cloud Functions | 10 min | ✅ Bajo |
| 3 | Deploy Firestore Rules | 5 min | ✅ Bajo |
| 4 | Deploy Hosting (Headers) | 10 min | ✅ Bajo |
| 5 | Validación | 10 min | ✅ Bajo |

**Total**: ~45 minutos  
**Downtime**: 0 segundos (no requiere downtime)

---

## 📋 CHECKLIST PRE-DEPLOYMENT

Antes de iniciar, verifica:

- [ ] Tienes acceso a Firebase CLI
- [ ] Estás en la rama `main` o `master`
- [ ] Todos los cambios están guardados
- [ ] Backups recientes existen
- [ ] No hay usuarios conectados en horario crítico

```bash
# Verificar estatus actual
firebase projects:list
firebase firestore:indexes
firebase functions:list
```

---

## 🚀 FASE 1: BACKUP (5 minutos)

### Paso 1.1: Exportar datos actuales

```bash
# Desde PowerShell en el directorio firebase-web-app

# Backup de Firestore
firebase firestore:export ./backups/firestore_$(Get-Date -Format 'yyyyMMdd_HHmm')

# Backup de Cloud Functions
Copy-Item -Path "functions/index.js" -Destination "functions/index.js.backup_$(Get-Date -Format 'yyyyMMdd_HHmm')"

# Backup de Firestore Rules
Copy-Item -Path "firestore.rules" -Destination "firestore.rules.backup_$(Get-Date -Format 'yyyyMMdd_HHmm')"

# Backup de firebase.json
Copy-Item -Path "firebase.json" -Destination "firebase.json.backup_$(Get-Date -Format 'yyyyMMdd_HHmm')"
```

### Paso 1.2: Verificar backups

```bash
# Listar archivos creados
Get-ChildItem -Filter "*.backup_*"
```

---

## 🚀 FASE 2: CLOUD FUNCTIONS (10 minutos)

### Paso 2.1: Actualizar archivo index.js

**OPCIÓN A - Reemplazar completamente:**
```bash
# RESPALDO DEL ANTERIOR (seguridad)
Copy-Item -Path "functions/index.js" -Destination "functions/index.js.old"

# Copiar el nuevo archivo seguro
Copy-Item -Path "functions/index-SEGURO.js" -Destination "functions/index.js"
```

**OPCIÓN B - Actualizar manualmente:**

Si prefieres cambios graduales, abre `functions/index.js` y:

1. Busca `exports.cleanAndRecreateUser = functions.https.onRequest`
2. Reemplaza con la versión de `functions/index-SEGURO.js`
3. Busca `exports.syncAuthToFirestore = functions.https.onRequest`
4. Reemplaza con la versión de `functions/index-SEGURO.js`
5. Agregar nuevas funciones al final

### Paso 2.2: Validar sintaxis

```bash
# Entrar en directorio functions
cd functions

# Instalar dependencias si es necesario
npm install

# Validar sintaxis
node -c index.js

# Si no hay errores, volver atrás
cd ..
```

### Paso 2.3: Deploy de Functions

```bash
# Deploy SOLO de functions (no hosting)
firebase deploy --only functions

# Esperar a que termine... (~2 minutos)
# Verás: "✓ Deploy complete!"
```

### Paso 2.4: Verificar deployment

```bash
# Ver logs de functions
firebase functions:log --limit 20

# Buscar errores
firebase functions:log | Select-String "ERROR"
```

---

## 🚀 FASE 3: FIRESTORE RULES (5 minutos)

### Paso 3.1: Actualizar reglas

```bash
# Backup actual (por si acaso)
Copy-Item -Path "firestore.rules" -Destination "firestore.rules.old"

# Copiar nuevas reglas
Copy-Item -Path "firestore-SEGURO.rules" -Destination "firestore.rules"
```

### Paso 3.2: Validar reglas en consola

```bash
# Validar sintaxis (Firebase emulator)
firebase emulators:start --only firestore

# En otra terminal, probar reglas
# (Esto abrirá Firebase Emulator en http://localhost:4000)

# Cuando termines de probar:
# Presiona Ctrl+C en la primera terminal
```

### Paso 3.3: Deploy de Firestore Rules

```bash
# Deploy SOLO de firestore rules
firebase deploy --only firestore:rules

# Esperar a que termine... (~1 minuto)
```

### Paso 3.4: Verificar en Firebase Console

1. Ve a: **Firebase Console** → **Firestore** → **Rules**
2. Verifica que las nuevas reglas estén activas
3. Busca la función `isAdmin()` con try-catch

---

## 🚀 FASE 4: HOSTING HEADERS (10 minutos)

### Paso 4.1: Actualizar firebase.json

```bash
# Backup actual
Copy-Item -Path "firebase.json" -Destination "firebase.json.old"

# Copiar nueva configuración
Copy-Item -Path "firebase-SEGURO.json" -Destination "firebase.json"
```

### Paso 4.2: Validar JSON

```bash
# Validar que no hay errores de sintaxis
# Opción 1: Abrir en VS Code y ver si hay errores

# Opción 2: Validar con PowerShell
$json = Get-Content firebase.json | ConvertFrom-Json
if ($?) { Write-Host "✓ JSON válido" } else { Write-Host "✗ JSON inválido" }
```

### Paso 4.3: Deploy de Hosting

```bash
# Deploy SOLO de hosting
firebase deploy --only hosting

# Esperar a que termine... (~2-3 minutos)
# Verás la URL: https://executiveperformancek.firebaseapp.com
```

### Paso 4.4: Verificar headers

```bash
# Verificar que los headers están activos
# En tu navegador, abre las DevTools (F12)
# Tab: Network → Cargar la página → Click en index.html
# Ve a "Response Headers" y busca:
# - X-Content-Type-Options: nosniff
# - X-Frame-Options: SAMEORIGIN
# - Strict-Transport-Security: max-age=31536000
```

---

## ✅ FASE 5: VALIDACIÓN (10 minutos)

### Paso 5.1: Pruebas de funcionalidad

```bash
# 1. Abre tu app: https://executiveperformancek.firebaseapp.com
# 2. Intenta hacer login
# 3. Crea un cliente nuevo
# 4. Edita datos existentes
# 5. Si eres admin, prueba el panel admin

# TODO DEBE FUNCIONAR IGUAL QUE ANTES
```

### Paso 5.2: Probar Cloud Functions seguras

**IMPORTANTE**: Las antiguas URLs HTTP ya NO funcionan.

Si tenías código que llamaba a:
```javascript
// ❌ ANTIGUO - Ya no funciona
fetch('https://us-central1-executiveperformancek.cloudfunctions.net/cleanAndRecreateUser', {
  method: 'POST',
  body: JSON.stringify({ email: 'test@example.com' })
})

// ✅ NUEVO - Con llamadas seguras
import { httpsCallable } from 'firebase/functions';
const cleanAndRecreateUser = httpsCallable(functions, 'cleanAndRecreateUser');

try {
  const result = await cleanAndRecreateUser({ email: 'test@example.com' });
  console.log('Resultado:', result.data);
} catch (error) {
  console.error('Error:', error.message);
}
```

### Paso 5.3: Verificar seguridad

```bash
# Verificar que HTTP Functions están protegidas
# Intenta llamar a la URL antigua (NO debe funcionar):
# curl "https://us-central1-executiveperformancek.cloudfunctions.net/cleanAndRecreateUser" `
#      -H "Content-Type: application/json" `
#      -d '{"email":"test@example.com"}'

# RESULTADO ESPERADO: 403 Forbidden o 404 Not Found
```

### Paso 5.4: Revisar logs

```bash
# Ver logs de todas las operaciones
firebase functions:log --limit 50

# Buscar errores
firebase functions:log | Select-String "ERROR" | Head -20
```

---

## 🔄 ROLLBACK (SI ALGO SALE MAL)

Si encuentras problemas, aquí está el plan de rollback:

### Rollback Cloud Functions

```bash
# Restaurar archivo anterior
Copy-Item -Path "functions/index.js.old" -Destination "functions/index.js"

# Re-deploy
firebase deploy --only functions

# Esperar a que termine
```

### Rollback Firestore Rules

```bash
# Restaurar reglas anteriores
Copy-Item -Path "firestore.rules.old" -Destination "firestore.rules"

# Re-deploy
firebase deploy --only firestore:rules
```

### Rollback Hosting

```bash
# Restaurar firebase.json
Copy-Item -Path "firebase.json.old" -Destination "firebase.json"

# Re-deploy
firebase deploy --only hosting
```

### Restore completo desde backup

```bash
# Si todo se rompe, restaurar desde backup
firebase firestore:import ./backups/firestore_YYYYMMDD_HHMM

# NOTA: Reemplazar YYYYMMDD_HHMM con tu backup real
```

---

## 📊 POST-DEPLOYMENT CHECKLIST

Después de deployar, verifica:

- [ ] App funciona correctamente
- [ ] Login sigue funcionando
- [ ] Usuarios pueden crear clientes
- [ ] Admin panel funciona
- [ ] No hay errores en console del navegador
- [ ] Cloud Functions responden en Firebase Console
- [ ] Firestore Rules están activas
- [ ] Headers de seguridad están presentes (ver en DevTools → Network)

---

## 🔒 SEGURIDAD - CAMBIOS REALIZADOS

### Cloud Functions
✅ Autenticación requerida (onCall en lugar de onRequest)  
✅ Validación de rol admin  
✅ Rate limiting  
✅ Auditoría de acciones  

### Firestore
✅ Validación de datos en rules  
✅ Prevención de XSS  
✅ Protección de campos críticos  
✅ Acceso solo a datos propios  

### Hosting
✅ Content Security Policy (CSP)  
✅ Prevención de X-Frame-Options  
✅ HSTS habilitado  
✅ XSS Protection  

---

## 📞 SOPORTE

Si encuentras problemas:

1. Revisa los logs: `firebase functions:log`
2. Consulta la consola del navegador (F12)
3. Verifica Firestore Rules en Firebase Console
4. Compara con el documento `ESTRATEGIA_DEFENSIVA_SEGURIDAD.md`

---

## 📝 COMANDOS RÁPIDOS

```bash
# VER ESTADO COMPLETO
firebase deploy --dry-run

# DEPLOY SOLO FUNCTIONS
firebase deploy --only functions

# DEPLOY SOLO FIRESTORE
firebase deploy --only firestore:rules

# DEPLOY SOLO HOSTING
firebase deploy --only hosting

# DEPLOY TODO
firebase deploy

# VER LOGS EN TIEMPO REAL
firebase functions:log

# LISTAR FUNCTIONS DEPLOYADAS
firebase functions:list

# EMULAR LOCALMENTE
firebase emulators:start
```

---

**Versión**: 1.0  
**Fecha**: 10 Nov 2025  
**Responsable**: Equipo de Seguridad  
**Estado**: LISTO PARA IMPLEMENTAR
