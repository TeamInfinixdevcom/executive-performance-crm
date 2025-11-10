# 🔥 Executive Performance ICE - Sistema CRM

Aplicación web completa de gestión de clientes (CRM) desarrollada para ejecutivos de ICE con Node.js, Express y Firebase. Incluye **Panel de Administración** para gestión de usuarios.

## 📋 Características Principales

### 🎯 Sistema CRM
- ✅ Gestión completa de clientes ICE
- ✅ Búsqueda avanzada (nombre, cédula, servicios)
- ✅ Registro de interacciones con clientes
- ✅ Segmentación por categorías (PLATINO, ORO, PLATA, BRONCE)
- ✅ Interfaz responsive y moderna

### 👨‍💼 Panel de Administración (NUEVO)
- ✅ Gestión de usuarios desde interfaz web
- ✅ Creación de nuevos ejecutivos con email y contraseña
- ✅ Sistema de roles (Admin / Ejecutivo)
- ✅ Eliminación de usuarios
- ✅ Estadísticas del sistema
- ✅ Control de acceso centralizado en Firestore

### 🔐 Seguridad
- ✅ Autenticación con Firebase Authentication
- ✅ Control de acceso basado en Firestore
- ✅ Triple verificación de autorización
- ✅ Protección de rutas según rol

### 🛠️ Tecnología
- ✅ Backend Node.js con Express
- ✅ Firebase Admin SDK
- ✅ Firestore Database
- ✅ Firebase Authentication
- ✅ API RESTful
- ✅ Preparado para Firebase Hosting

## 🏗️ Estructura del Proyecto

```
firebase-web-app/
├── src/
│   ├── index.js                # Servidor Express principal
│   ├── config/
│   │   └── firebase.js         # Configuración de Firebase Admin SDK
│   ├── routes/
│   │   └── index.js            # Rutas de la API
│   ├── services/
│   │   └── firebaseService.js  # Servicios para Firestore
│   └── middleware/
│       └── auth.js             # Middleware de autenticación
├── public/
│   ├── index.html              # Dashboard principal CRM
│   ├── admin.html              # Panel de administración (NUEVO)
│   ├── login.html              # Página de login
│   ├── register.html           # Página de registro (deshabilitada)
│   ├── css/
│   │   └── style.css           # Estilos CSS completos
│   └── js/
│       ├── auth.js             # Autenticación (actualizado con Firestore)
│       ├── clients.js          # Gestión de clientes
│       ├── admin-panel.js      # Panel de administración (NUEVO)
│       └── firebase-config.js  # Configuración Firebase frontend
├── PANEL_ADMIN.md              # Documentación del Panel Admin (NUEVO)
├── CONTROL_ACCESO.md           # Documentación de control de acceso
├── CONFIGURACION_FIREBASE.md   # Guía de configuración Firebase
├── package.json                # Dependencias del proyecto
├── .env                        # Variables de entorno
├── firebase.json               # Configuración de Firebase Hosting
└── README.md                   # Este archivo
```

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Firebase

#### a) Crear proyecto en Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita **Firestore Database**
4. Habilita **Authentication** con Email/Password

#### b) Obtener credenciales de servicio
1. En Firebase Console, ve a **Configuración del proyecto** (⚙️)
2. Ve a la pestaña **Cuentas de servicio**
3. Haz clic en **Generar nueva clave privada**
4. Descarga el archivo JSON con las credenciales

#### c) Configurar variables de entorno
1. Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edita el archivo `.env` con tus credenciales:
   ```env
   PORT=3000
   NODE_ENV=development
   
   FIREBASE_PROJECT_ID=tu-proyecto-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_CLAVE_PRIVADA_AQUI\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
   FIREBASE_DATABASE_URL=https://tu-proyecto.firebaseio.com
   ```

### 3. Ejecutar la Aplicación

#### Modo Desarrollo (con auto-reload)
```bash
npm run dev
```

#### Modo Producción
```bash
npm start
```

La aplicación estará disponible en: `http://localhost:3000`

## �‍💼 Panel de Administración

### ⚡ Acceso al Panel Admin

1. **Crear el primer usuario administrador** (ver sección "Configuración Inicial" abajo)
2. Inicia sesión en `/login.html`
3. Verás el botón **"👨‍💼 Panel Admin"** en la esquina superior derecha
4. Accede a `/admin.html` para gestionar usuarios

### 🎯 Funciones del Panel Admin

- **Crear Usuarios**: Agrega nuevos ejecutivos con email y contraseña
- **Asignar Roles**: Define si es Administrador o Ejecutivo
- **Ver Usuarios**: Lista completa de usuarios registrados
- **Eliminar Usuarios**: Revoca acceso a usuarios
- **Estadísticas**: Total de usuarios, admins, ejecutivos y clientes

**📖 Documentación Completa**: Ver [PANEL_ADMIN.md](PANEL_ADMIN.md)

## 🔐 Configuración Inicial de Usuarios

### Opción 1: Crear Admin desde Firebase Console (Recomendado)

1. Ve a **Firebase Console → Authentication**
2. Crea un usuario manualmente
3. Copia el UID del usuario
4. Ve a **Firestore → Crea colección `users`**
5. Crea un documento con el UID:

```javascript
{
  uid: "el-uid-copiado",
  name: "Tu Nombre",
  email: "admin@ice.go.cr",
  role: "admin",
  isActive: true,
  createdAt: (timestamp actual)
}
```

### Opción 2: Convertir Usuario Existente en Admin

Si ya tienes un usuario creado:
1. Ve a **Firestore → Colección `users`**
2. Busca tu documento de usuario
3. Edita el campo `role` y cámbialo a `"admin"`

### Después de Crear el Primer Admin

1. Inicia sesión con ese usuario admin
2. Accede al Panel Admin
3. Crea todos los ejecutivos que necesites desde la interfaz

## 📡 API Endpoints

### Colecciones en Firestore

#### `clients` - Clientes ICE
Estructura:
```javascript
{
  cedula: "1-2345-6789",
  nombre: "Juan Pérez",
  email: "juan@example.com",
  fechaNacimiento: "1985-03-15",
  domicilio: "San José, Costa Rica",
  serviciosMoviles: ["8888-8888"],
  serviciosFijos: ["2222-2222"],
  tipoPlan: "Postpago",
  estadoPlan: "Activo",
  segmento: "ORO",
  puntajeScore: 850,
  categoriaCrediticia: "A1",
  notas: "Cliente VIP",
  executiveId: "uid-del-ejecutivo",
  interacciones: [
    {
      fecha: "2024-01-15",
      tipo: "renovacion",
      detalle: "Renovó plan premium"
    }
  ],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `users` - Usuarios del Sistema
Estructura:
```javascript
{
  uid: "firebase-auth-uid",
  name: "María González",
  email: "maria@ice.go.cr",
  role: "executive",  // "admin" o "executive"
  isActive: true,
  createdAt: Timestamp,
  createdBy: "uid-del-admin"
}
```

### API REST (Backend)

#### Obtener todos los items de una colección
```http
GET /api/items
```

#### Crear un nuevo item
```http
POST /api/items
Content-Type: application/json

{
  "name": "Nombre del item",
  "description": "Descripción",
  "status": "activo"
}
```

#### Actualizar un item
```http
PUT /api/items/:id
Content-Type: application/json

{
  "name": "Nuevo nombre",
  "status": "inactivo"
}
```

#### Eliminar un item
```http
DELETE /api/items/:id
```

## 🔐 Sistema de Autenticación
router.get('/protected', authMiddleware, (req, res) => {
    res.json({ user: req.user });
});
```

El frontend debe enviar el token en el header:
```javascript
fetch('/api/protected', {
    headers: {
        'Authorization': 'Bearer TU_TOKEN_AQUI'
    }
})
```

## 🌐 Desplegar en Firebase Hosting

### 1. Instalar Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Iniciar sesión
```bash
firebase login
```

### 3. Inicializar Firebase
```bash
firebase init
```

Selecciona:
- ✅ Hosting
- ✅ Functions (si quieres desplegar el backend)

### 4. Desplegar
```bash
firebase deploy
```

## 📦 Scripts Disponibles

- `npm start` - Ejecuta la aplicación en modo producción
- `npm run dev` - Ejecuta la aplicación en modo desarrollo con nodemon
- `npm run deploy` - Despliega la aplicación en Firebase

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **Firebase Admin SDK** - Backend de Firebase
- **Firestore** - Base de datos NoSQL
- **HTML/CSS/JavaScript** - Frontend
- **dotenv** - Gestión de variables de entorno
- **CORS** - Manejo de peticiones cross-origin

## 📝 Notas Importantes

1. **Seguridad**: NUNCA subas tu archivo `.env` a Git
2. **Credenciales**: Mantén tus credenciales de Firebase seguras
3. **Firestore Rules**: Configura reglas de seguridad apropiadas en producción
4. **CORS**: Ajusta la configuración de CORS según tus necesidades en producción

## 🐛 Solución de Problemas

### Error: Firebase Admin SDK no inicializado
- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que el archivo `.env` esté en la raíz del proyecto

### Error: Cannot find module 'express'
```bash
npm install
```

### Puerto 3000 ya en uso
Cambia el puerto en el archivo `.env`:
```env
PORT=3001
```

## 📄 Licencia

MIT

## 👤 Autor

Tu nombre/organización

---

⭐ Si este proyecto te fue útil, no olvides darle una estrella!
   ```
   npm start
   ```

5. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`.

## Usage

- The application allows users to register, log in, and interact with Firebase services.
- Front-end interactions are handled in `public/js/app.js`.
- Backend logic is managed in the `src` directory.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.