# 🚨 ACCIÓN REQUERIDA - Habilitar Firestore

## ✅ Buenas Noticias

Tu usuario **rmadrigalj@ice.go.cr** ya existe en Firebase Authentication!
- UID: `yF8fwbUQFpXXlOfUMyvQmHmBgNI3`
- Contraseña: `Perla2031`

## ⚠️ Falta un paso

Necesitas **habilitar Firestore** en tu proyecto de Firebase.

---

## 🔧 Pasos para Habilitar Firestore (2 minutos)

### Opción 1: Usar el enlace directo

Abre este enlace en tu navegador:

```
https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=executiveperformancek
```

1. Haz clic en **"Enable"** (Habilitar)
2. Espera 1-2 minutos a que se active
3. Continúa con los pasos de abajo

---

### Opción 2: Desde Firebase Console

1. Ve a **Firebase Console**: https://console.firebase.google.com/
2. Selecciona tu proyecto **"executiveperformancek"**
3. En el menú lateral, busca **"Firestore Database"**
4. Haz clic en **"Create Database"** (Crear base de datos)
5. Selecciona modo:
   - **Modo de prueba** (para desarrollo) - Recomendado al inicio
   - **Modo de producción** (para uso real)
6. Selecciona la ubicación: **us-central** (o la más cercana)
7. Haz clic en **"Habilitar"**

---

## 🎯 Después de Habilitar Firestore

### Ejecuta este comando de nuevo:

```bash
node create-first-admin.js
```

Esto agregará tu usuario a Firestore con rol de admin.

---

## 🔐 O Hazlo Manualmente en Firebase Console

Si prefieres hacerlo manual:

1. Ve a **Firestore Database** (después de habilitarlo)
2. Haz clic en **"Start collection"**
3. Collection ID: `users`
4. Haz clic en **"Next"**
5. Document ID: `yF8fwbUQFpXXlOfUMyvQmHmBgNI3` (el UID de arriba)
6. Agrega estos campos:

```
uid: yF8fwbUQFpXXlOfUMyvQmHmBgNI3
name: Administrador ICE
email: rmadrigalj@ice.go.cr
role: admin
isActive: true
createdAt: [haz clic en el ícono de reloj para timestamp]
createdBy: system
```

7. Haz clic en **"Save"**

---

## ✅ Verificar que Todo Funciona

### 1. Inicia el servidor:

```bash
npm run dev
```

### 2. Abre en tu navegador:

```
http://localhost:3000/login.html
```

### 3. Inicia sesión:

```
Email: rmadrigalj@ice.go.cr
Password: Perla2031
```

### 4. Deberías ver:

- ✅ Login exitoso
- ✅ Botón dorado **"👨‍💼 Panel Admin"** visible
- ✅ Puedes acceder al panel de administración

---

## 🎉 ¡Listo!

Una vez que habilites Firestore y agregues el documento, podrás:

1. ✅ Iniciar sesión con tu email y contraseña
2. ✅ Acceder al Panel Admin
3. ✅ Crear nuevos usuarios ejecutivos
4. ✅ Gestionar el sistema completo

---

## 📞 Resumen

| Item | Estado | Valor |
|------|--------|-------|
| Email | ✅ Creado | rmadrigalj@ice.go.cr |
| Contraseña | ✅ Definida | Perla2031 |
| UID | ✅ Generado | yF8fwbUQFpXXlOfUMyvQmHmBgNI3 |
| Authentication | ✅ Habilitado | Funcionando |
| Firestore | ⚠️ Pendiente | Necesita habilitación |
| Documento en Firestore | ⏳ Pendiente | Crear después de habilitar |

---

**Siguiente paso**: Habilita Firestore usando uno de los métodos de arriba 👆
