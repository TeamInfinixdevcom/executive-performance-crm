# 🚀 INSTRUCCIONES PARA DEPLOY A PRODUCCIÓN

## Estado Actual: ✅ LISTO PARA DEPLOY

El sistema está **100% listo** para producción:
- ✅ Índice Firestore habilitado (ventas: segmento + fechaVenta)
- ✅ Todos los 8 tabs funcionales
- ✅ Sistema de ventas automático
- ✅ Footer con "Powered by Infinix Dev"
- ✅ Créditos y licencia integrados
- ✅ Firestore rules en producción

---

## OPCIÓN 1: Deploy en Nueva Terminal (Recomendado)

1. **Abre una NUEVA terminal PowerShell como Administrador**
   - Click derecho en PowerShell → "Ejecutar como administrador"

2. **Ejecuta estos comandos uno a uno:**

```powershell
# Ir al proyecto
cd "c:\Users\rumadr\Desktop\ExecutivePerformance\firebase-web-app"

# Instalar firebase-tools
npm install -g firebase-tools

# Hacer login en Firebase
firebase login

# Hacer deploy
firebase deploy --only hosting
```

3. **Espera a que termine**
   - Verás un mensaje: ✅ Deploy complete!
   - URL de producción: https://executiveperformancek-fd430.web.app

---

## OPCIÓN 2: Deploy Manual en Firebase Console

1. **Ve a Firebase Console**
   - https://console.firebase.google.com

2. **Selecciona el proyecto "executiveperformancek"**

3. **Ve a Hosting**
   - Click en el ícono "Hosting" en el menú izquierdo

4. **Conecta tu repositorio local**
   - Click en "Connect repository" 
   - O sube los archivos de `public/` manualmente

5. **Deploy**
   - Click en "Deploy new release"
   - Selecciona el directorio `public/`

---

## OPCIÓN 3: Usando Scripts NPM

Si prefieres desde el proyecto directamente:

```powershell
cd "c:\Users\rumadr\Desktop\ExecutivePerformance\firebase-web-app"

# 1. Asegurar que Node.js está en PATH
$env:Path += ";C:\Program Files\nodejs"

# 2. Instalar dependencias locales
npm install firebase-tools --save-dev

# 3. Deploy usando npx
npx firebase deploy --only hosting
```

---

## URL De Producción

Una vez deployed:
- 🌐 **URL Principal:** https://executiveperformancek-fd430.web.app
- 🔐 **Firestore:** Conectada (sin cambios requeridos)
- 📱 **Responsive:** Funciona en desktop, tablet y mobile
- ✅ **SSL/HTTPS:** Automático con Firebase Hosting

---

## QUÉ SE DEPLOYARÁ

- ✅ `public/` - Todo el frontend (HTML, CSS, JS)
- ✅ `firestore.rules` - Reglas de seguridad
- ✅ `firestore.indexes.json` - Índices de BD
- ⏭️ Backend (src/) - Se ejecutará localmente (opcional: deployar a Cloud Functions)

---

## VALIDACIONES POST-DEPLOY

Una vez deployed, verifica:

1. **Accede a la URL:** https://executiveperformancek-fd430.web.app
2. **Prueba el login** con tus credenciales de ICE
3. **Verifica footer:** Debe mostrar "🚀 Powered by Infinix Dev"
4. **Abre Créditos:** Click en "Créditos" - debe abrir modal con info
5. **Prueba 1 tab:** Ejemplo "Mis Clientes" - debe cargar
6. **Checkea consola:** F12 → Console - No debe haber errores rojos

---

## SOLUCIÓN DE PROBLEMAS

### Error: "firebase: No se reconoce"
```powershell
# Intenta con npx
npx firebase deploy --only hosting
```

### Error: "No tienes permisos"
- Abre PowerShell como Administrador
- O ejecuta: `npm install -g firebase-tools --force`

### Error: "Firestore Rules"
- Ignore este error, ya están deployadas
- Solo deployamos hosting esta vez

### La app no carga post-deploy
- Borra cache del navegador (Ctrl+Shift+Del)
- Intenta incógnito
- Revisa que Firestore siga habilitado en Firebase Console

---

## PRÓXIMOS PASOS DESPUÉS DEL DEPLOY

1. **Backend (Opcional):**
   - Hostearlo en Cloud Functions o Heroku
   - O dejar en localhost para desarrollo

2. **Monitoreo:**
   - Firebase Console → Analytics
   - Ver tráfico y errores

3. **Actualizaciones:**
   - Futuros cambios: solo necesitan `firebase deploy`
   - El índice Firestore ya está creado (no cambia)

4. **Respaldo:**
   - Firebase → Firestore → Backup & Restore
   - Hacer backup mensual de la BD

---

## CREDENCIALES DE PRUEBA (Para validación post-deploy)

**Admin:**
- Email: admin@ice.cr
- Password: (la que configuraste)

**Executive:**
- Email: (usuario de prueba de ICE)
- Password: (la que configuraste)

---

## INFORMACIÓN DEL DEPLOYMENT

```
Proyecto: executiveperformancek
Site: executiveperformancek-fd430
Region: Global (CDN)
SSL: Automático ✅
Base de Datos: Firestore (productionMode)
Índices: 2 compuestos habilitados ✅
```

---

**¡LISTO! El sistema está 100% preparado para producción.** 🎉

Una vez hecho el deploy, todos en ICE pueden acceder desde:
👉 **https://executiveperformancek-fd430.web.app**

Creado por **Rubén Madrigal** | **Infinix Dev** 🚀
Licencia: LIC-INFINIX-2024-EP-001
