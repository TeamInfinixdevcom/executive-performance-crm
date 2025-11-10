# 🔐 Control de Acceso al Sistema

## Sistema Implementado

✅ **Solo usuarios autorizados pueden acceder al sistema**

El sistema tiene una lista blanca de correos electrónicos autorizados. Solo las personas cuyos correos estén en esta lista podrán:
- Registrarse en el sistema
- Iniciar sesión
- Acceder a la aplicación

## 📝 Cómo Agregar Usuarios Autorizados

### Paso 1: Abrir el archivo de usuarios autorizados
Abre el archivo: `public/js/authorized-users.js`

### Paso 2: Agregar correos a la lista

```javascript
export const AUTHORIZED_USERS = [
    'teaminfinixdev@gmail.com',  // Este es el administrador (primer correo)
    'ejecutivo1@ice.go.cr',      // Agrega más correos aquí
    'ejecutivo2@ice.go.cr',
    'ejecutivo3@ice.go.cr',
];
```

### Paso 3: Guardar el archivo
Los cambios son inmediatos. Los nuevos usuarios ya pueden registrarse.

## 🛡️ Niveles de Seguridad Implementados

### Nivel 1: Registro
- Al intentar registrarse, se verifica si el correo está en la lista
- Si NO está autorizado: ❌ "Acceso denegado"
- Si está autorizado: ✅ Puede crear su cuenta

### Nivel 2: Login
- Al iniciar sesión, se verifica nuevamente la autorización
- Si NO está autorizado: ❌ "Acceso denegado"
- Si está autorizado: ✅ Puede entrar al sistema

### Nivel 3: Dentro de la Aplicación
- Cada vez que carga la página, se verifica la autorización
- Si alguien fue removido de la lista: ❌ Es expulsado automáticamente
- Si está autorizado: ✅ Puede usar el sistema normalmente

## 👨‍💼 Rol de Administrador

El **primer correo** de la lista es considerado administrador:
```javascript
'teaminfinixdev@gmail.com',  // ← Este es el admin
```

En futuras versiones, el administrador podrá:
- Ver todos los clientes de todos los ejecutivos
- Gestionar usuarios desde la interfaz
- Ver estadísticas generales

## ⚠️ Importante

1. **NO elimines tu propio correo de la lista** o perderás acceso
2. **Escribe los correos exactamente** como están en Firebase Auth
3. Los correos NO son case-sensitive (mayúsculas/minúsculas no importan)
4. Puedes agregar tantos usuarios como necesites

## 🔄 Remover Acceso a un Usuario

Si necesitas revocar el acceso de alguien:

1. Abre `public/js/authorized-users.js`
2. Elimina o comenta su correo:
```javascript
export const AUTHORIZED_USERS = [
    'teaminfinixdev@gmail.com',
    // 'usuario-removido@ice.go.cr',  // ← Comentado, ya no tiene acceso
    'ejecutivo-activo@ice.go.cr',
];
```
3. Guarda el archivo
4. La próxima vez que intente entrar, será rechazado

## 📧 Notificar a Nuevos Usuarios

Cuando agregues un usuario nuevo, infórmale:

```
Hola [Nombre],

Te he dado acceso al sistema CRM de Executive Performance ICE.

Para registrarte:
1. Ve a: [URL del sistema]
2. Haz clic en "Regístrate aquí"
3. Usa tu correo: [correo@ice.go.cr]
4. Crea una contraseña segura
5. ¡Listo! Ya puedes gestionar tus clientes

Saludos,
[Tu nombre]
```

## 🚀 Ejemplo de Uso

### Usuario Autorizado:
```
Correo: ejecutivo1@ice.go.cr
Estado: ✅ En la lista
Resultado: Puede registrarse y usar el sistema
```

### Usuario NO Autorizado:
```
Correo: persona-externa@gmail.com
Estado: ❌ NO está en la lista
Resultado: "Acceso denegado. Contacta al administrador"
```

## 🔮 Mejoras Futuras (Opcional)

Si necesitas más control, podemos implementar:
- Panel de administración para gestionar usuarios
- Roles y permisos (ejecutivo, supervisor, admin)
- Sistema de aprobación por correo
- Expiración de cuentas
- Logs de acceso

¿Necesitas alguna de estas funcionalidades?
