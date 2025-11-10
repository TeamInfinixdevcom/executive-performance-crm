# 👨‍💼 Panel de Administración de Usuarios

## 📋 Descripción

El Panel de Administración permite gestionar los usuarios que tienen acceso al sistema CRM de Executive Performance ICE. Solo los usuarios con rol de **Administrador** pueden acceder a este panel.

## 🎯 Características

### ✅ Funcionalidades del Panel Admin

1. **Crear Nuevos Usuarios**
   - Agregar ejecutivos con email y contraseña
   - Asignar roles (Ejecutivo o Administrador)
   - El admin proporciona la contraseña que el usuario usará

2. **Gestionar Usuarios Existentes**
   - Ver lista completa de usuarios registrados
   - Información detallada de cada usuario (nombre, email, rol, fecha de registro)
   - Estado activo/inactivo

3. **Eliminar Usuarios**
   - Eliminar usuarios que ya no necesitan acceso
   - Los clientes del usuario no se eliminan

4. **Estadísticas del Sistema**
   - Total de usuarios
   - Número de administradores
   - Número de ejecutivos
   - Total de clientes en el sistema

## 🚀 Cómo Acceder al Panel Admin

### Para Administradores:

1. Inicia sesión normalmente en `login.html`
2. Una vez en la app principal, verás un botón dorado **"👨‍💼 Panel Admin"** en la esquina superior derecha
3. Haz clic para acceder al panel de administración

## 📝 Cómo Crear un Nuevo Usuario

1. **Accede al Panel Admin**
2. **Completa el formulario "Agregar Nuevo Usuario":**
   - **Nombre Completo**: Nombre del ejecutivo
   - **Correo Electrónico**: Email que usará para entrar (ejemplo: `ejecutivo@ice.go.cr`)
   - **Contraseña**: Define la contraseña que le darás al usuario (mínimo 6 caracteres)
   - **Rol**: Selecciona "Ejecutivo" o "Administrador"

3. **Haz clic en "💾 Crear Usuario"**
4. El sistema creará la cuenta automáticamente
5. **Importante**: Proporciona el email y la contraseña al nuevo usuario para que pueda entrar

## 👥 Roles del Sistema

### 🔑 Administrador
- Acceso al Panel Admin
- Puede crear y eliminar usuarios
- Ve todos los clientes del sistema
- Gestión completa

### 👤 Ejecutivo
- Solo accede a la app principal
- Ve únicamente sus propios clientes
- No puede crear otros usuarios
- No puede acceder al Panel Admin

## ⚙️ Migración del Sistema Anterior

### Antes (Sistema con Archivo Estático):
- Los emails autorizados estaban en `authorized-users.js`
- Había que editar el código para agregar usuarios
- No había gestión dinámica

### Ahora (Sistema con Firestore):
- Los usuarios se gestionan desde el Panel Admin
- Todo se guarda en la base de datos Firestore (colección `users`)
- No necesitas editar código
- Control total desde la interfaz web

## 🔐 Sistema de Control de Acceso

### Triple Verificación de Seguridad:

1. **En el Registro**: El registro directo está deshabilitado. Solo el admin crea usuarios.

2. **En el Login**: 
   - El sistema verifica que el email exista en Firestore
   - Verifica que el usuario esté activo (`isActive: true`)

3. **En la App Principal**:
   - Verifica sesión activa
   - Verifica autorización en Firestore
   - Redirige si no está autorizado

## 📊 Estructura de Datos en Firestore

### Colección: `users`

Cada documento de usuario contiene:

```javascript
{
  uid: "firebase-auth-uid",
  name: "Juan Pérez",
  email: "juan.perez@ice.go.cr",
  role: "executive",  // o "admin"
  isActive: true,
  createdAt: Timestamp,
  createdBy: "uid-del-admin-que-lo-creo"
}
```

## ⚠️ Consideraciones Importantes

1. **Primer Usuario Admin**:
   - El primer usuario debe crearse manualmente desde Firebase Console
   - O puedes convertir un usuario existente en admin editando su rol en Firestore

2. **Eliminación de Usuarios**:
   - Al eliminar un usuario, este pierde acceso inmediato
   - Los clientes asociados NO se eliminan
   - Para eliminar completamente del Authentication, usa Firebase Console

3. **Contraseñas**:
   - Las contraseñas se manejan por Firebase Authentication
   - El admin define la contraseña inicial
   - Los usuarios pueden cambiarla después (función futura)

4. **Seguridad**:
   - Solo usuarios con `role: "admin"` pueden acceder al panel
   - El botón de Panel Admin solo se muestra a administradores

## 🛠️ Configuración Inicial

### Paso 1: Crear el Primer Admin

Opción A - Desde Firebase Console:
1. Ve a Firebase Console → Authentication
2. Crea manualmente el primer usuario
3. Ve a Firestore → Colección `users`
4. Crea un documento con el UID del usuario:
```
{
  uid: "el-uid-del-usuario",
  name: "Tu Nombre",
  email: "tuadmin@ice.go.cr",
  role: "admin",
  isActive: true,
  createdAt: (timestamp actual)
}
```

Opción B - Habilitar temporalmente el registro:
1. En `auth.js`, comenta temporalmente la línea que bloquea el registro
2. Regístrate normalmente
3. Ve a Firestore y cambia tu `role` a `"admin"`
4. Descomenta la línea en `auth.js`

### Paso 2: Usa el Panel Admin

Una vez que tengas un usuario admin:
1. Inicia sesión
2. Accede al Panel Admin
3. Crea todos los usuarios ejecutivos que necesites

## 📞 Soporte

Si tienes problemas:
1. Verifica que Firebase Authentication esté habilitado
2. Verifica que Firestore tenga la colección `users`
3. Revisa la consola del navegador para errores
4. Verifica que el primer usuario tenga `role: "admin"`

---

## 🎉 Resumen

✅ **Antes**: Editabas código en `authorized-users.js`  
✅ **Ahora**: Panel web visual para gestionar usuarios  
✅ **Beneficios**: 
- Más profesional
- Más seguro
- Más fácil de usar
- No necesitas tocar código
- Todo centralizado en Firestore

🚀 **¡Ahora puedes gestionar tu equipo de ejecutivos de forma profesional!**
