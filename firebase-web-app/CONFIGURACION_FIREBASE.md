# 🔥 Configuración de Firebase - Pasos Finales

## ✅ Backend configurado
El archivo `.env` ya está configurado con las credenciales del servidor.

## 📝 Configurar Frontend (Cliente)

Para que el sistema de autenticación funcione, necesitas configurar el archivo `public/js/firebase-config.js` con las credenciales del cliente web.

### Pasos:

1. **Ve a Firebase Console:**
   - https://console.firebase.google.com/
   - Selecciona el proyecto "ExecutivePerformanceK"

2. **Ve a Configuración del proyecto:**
   - Haz clic en el ícono de engranaje ⚙️
   - Selecciona "Configuración del proyecto"

3. **En "Tus aplicaciones":**
   - Si no tienes una app web, haz clic en el ícono `</>` (Web)
   - Dale un nombre (ejemplo: "Executive Performance Web")
   - NO marques "Firebase Hosting" por ahora
   - Haz clic en "Registrar app"

4. **Copia el firebaseConfig:**
   Verás algo como:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "executiveperformancek.firebaseapp.com",
     projectId: "executiveperformancek",
     storageBucket: "executiveperformancek.firebasestorage.app",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

5. **Actualiza el archivo `public/js/firebase-config.js`:**
   - Reemplaza los valores en el firebaseConfig con los que copiaste

## 🔐 Habilitar Authentication

1. **En Firebase Console:**
   - Ve a "Authentication" en el menú lateral
   - Haz clic en "Empezar" o "Get Started"

2. **Habilita Email/Password:**
   - En la pestaña "Sign-in method"
   - Haz clic en "Email/Password"
   - Activa el interruptor
   - Haz clic en "Guardar"

## 🗄️ Habilitar Firestore

1. **En Firebase Console:**
   - Ve a "Firestore Database" en el menú lateral
   - Haz clic en "Crear base de datos"

2. **Configuración:**
   - Selecciona "Modo de producción" o "Modo de prueba"
   - Elige la ubicación (recomendado: us-central)
   - Haz clic en "Habilitar"

## 🚀 Iniciar la aplicación

Una vez configurado todo:

```powershell
npm run demo
```

Abre en el navegador: http://localhost:3000

¡Y listo! Tu sistema estará funcionando completamente.
