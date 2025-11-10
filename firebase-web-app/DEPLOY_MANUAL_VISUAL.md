# 🚀 DEPLOY MANUAL PASO A PASO

## Paso 1: Ve a Firebase Console Hosting

URL: https://console.firebase.google.com/project/executiveperformancek/hosting

---

## Paso 2: Conecta tu directorio local

En Firebase Console → Hosting → "Conectar repositorio" O "Subir archivo"

**OPCIÓN A: Subir directorio `public/` completo**

1. Click en el botón de menú (⋮)
2. Selecciona "Subir archivo"
3. Selecciona la carpeta: `c:\Users\rumadr\Desktop\ExecutivePerformance\firebase-web-app\public`
4. Firebase automáticamente deployará todo

---

## Paso 3: Usa Firebase CLI desde aquí

Si quieres desde terminal, abre NUEVA terminal PowerShell y copia esto exacto:

```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
cd c:\Users\rumadr\Desktop\ExecutivePerformance\firebase-web-app
C:\Program` Files\nodejs\npm.cmd install -g firebase-tools
firebase login
firebase deploy --only hosting
```

---

## Lo más fácil: Arrastra y suelta

En Firebase Console → Hosting:
1. Arrastra la carpeta `public/` a la zona de upload
2. Espera a que termine
3. ¡Listo! Tu app está en producción

---

**URL final será:**
https://executiveperformancek-fd430.web.app

Creado por Rubén Madrigal | Infinix Dev 🚀
