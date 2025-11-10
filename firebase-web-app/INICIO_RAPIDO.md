# 🚀 INICIO RÁPIDO - Panel de Administración

## ⚡ Pasos para empezar (5 minutos)

### 1️⃣ Asegúrate de tener Firebase configurado

**Firebase Console** → Tu proyecto `executiveperformancek`:
- ✅ Authentication habilitado (Email/Password)
- ✅ Firestore Database creado

---

### 2️⃣ Crea tu primer usuario ADMIN

#### Opción más rápida - Firebase Console:

1. **Authentication** → **Add user**
   ```
   Email: tuadmin@ice.go.cr
   Password: TuPasswordSegura123
   ```
   ✅ Copia el **UID** del usuario

2. **Firestore Database** → **Start collection**
   ```
   Collection ID: users
   ```

3. **Add document**
   ```
   Document ID: [pega el UID copiado]
   
   Fields:
   uid: [el mismo UID]
   name: "Tu Nombre"
   email: "tuadmin@ice.go.cr"
   role: "admin"
   isActive: true
   createdAt: [timestamp - haz clic en el reloj]
   ```

---

### 3️⃣ Inicia el servidor

```bash
npm run dev
```

---

### 4️⃣ Accede al sistema

1. Abre: `http://localhost:3000/login.html`

2. Login:
   ```
   Email: tuadmin@ice.go.cr
   Password: TuPasswordSegura123
   ```

3. Verás el botón dorado: **👨‍💼 Panel Admin**

4. Haz clic y empieza a agregar usuarios

---

## 🎯 Crear un nuevo usuario desde el Panel

1. Completa el formulario:
   ```
   Nombre: Juan Pérez
   Email: juan.perez@ice.go.cr
   Contraseña: password123
   Rol: Ejecutivo
   ```

2. Clic en **💾 Crear Usuario**

3. Listo! Dale el email y contraseña a Juan para que entre

---

## ✅ Checklist Final

- [ ] Firebase Authentication habilitado
- [ ] Firestore Database creado
- [ ] Colección `users` creada
- [ ] Primer usuario admin creado en Firestore
- [ ] Servidor corriendo (`npm run dev`)
- [ ] Login exitoso con usuario admin
- [ ] Botón "Panel Admin" visible
- [ ] Primer ejecutivo creado desde el panel

---

## 🆘 Si algo falla

### No veo el botón "Panel Admin"
- Verifica que en Firestore tu usuario tenga `role: "admin"`

### Error al crear usuario
- Verifica que `firebase-config.js` tenga tus credenciales del frontend
- Revisa la consola del navegador (F12)

### "Acceso denegado" al hacer login
- Verifica que el usuario exista en Firestore colección `users`
- Verifica que `isActive: true`

---

## 📚 Más información

- Documentación completa: `PANEL_ADMIN.md`
- Resumen detallado: `RESUMEN_PANEL_ADMIN.md`
- README general: `README.md`

---

🎉 **¡Eso es todo! Ya puedes gestionar usuarios desde tu panel web.**
