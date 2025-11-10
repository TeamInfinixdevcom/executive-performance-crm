# 🚀 GUÍA: Subir Executive Performance a GitHub

## PASO 1: Crear repositorio en GitHub

1. Ve a https://github.com/new
2. **Nombre:** `executive-performance-crm`
3. **Descripción:** `CRM empresarial para gestión de clientes y ventas - Desarrollado por Infinix Dev`
4. **Público:** ☑️ Sí (público)
5. **Inicializar con README:** ☐ No (lo haremos después)
6. **Click en "Create repository"**

---

## PASO 2: Preparar el proyecto local

En PowerShell, en la carpeta del proyecto:

```powershell
cd "c:\Users\rumadr\Desktop\ExecutivePerformance\firebase-web-app"

# Inicializar Git (si no está ya)
git init

# Configurar usuario (si no lo has hecho)
git config user.name "Rubén Madrigal"
git config user.email "rmadrigalj@ice.go.cr"
```

---

## PASO 3: Crear .gitignore

Ya debe existir, pero asegúrate que tenga:

```
node_modules/
.env
.env.local
*.log
.DS_Store
*.swp
functions/node_modules/
firebase-debug.log
.firebase/
dist/
build/
```

---

## PASO 4: Agregar y hacer commit

```powershell
# Agregar todos los archivos
git add .

# Primer commit
git commit -m "🎉 Initial commit: Executive Performance CRM v1.0 - Infinix Dev"

# Ver el status
git status
```

---

## PASO 5: Conectar con GitHub

```powershell
# Agregar remoto (reemplaza USERNAME con tu usuario de GitHub)
git remote add origin https://github.com/TeamInfinixDev/executive-performance-crm.git

# Verificar
git remote -v
```

---

## PASO 6: Hacer push (subir a GitHub)

```powershell
# Renombrar rama a main (si no lo está)
git branch -M main

# Push inicial (puede pedir credenciales)
git push -u origin main
```

---

## PASO 7: Crear README.md profesional

En la raíz del proyecto, crea `README.md` con:

```markdown
# 🎯 Executive Performance CRM

[![Infinix Dev](https://img.shields.io/badge/Made%20by-Infinix%20Dev-blue?style=for-the-badge)](https://infinixdev.com)
[![License](https://img.shields.io/badge/License-LIC--INFINIX--2024--EP--001-green?style=for-the-badge)](LICENSE)

Plataforma profesional de gestión de clientes y seguimiento de ventas desarrollada para **ICE (Instituto Costarricense de Electricidad)**.

**Creado por:** Rubén Madrigal | **Empresa:** Infinix Dev | **Año:** 2024

---

## ✨ Características

- ✅ 8 tabs funcionales completos
- ✅ Sistema automático de seguimiento de ventas
- ✅ Dashboard con métricas en tiempo real
- ✅ Gestión de clientes (CRUD)
- ✅ Pipeline de ventas (5 estados)
- ✅ Reportes avanzados y exportación Excel
- ✅ Autenticación Firebase
- ✅ Control de acceso por roles (Admin/Executive)
- ✅ Firestore Database
- ✅ Diseño responsive

---

## 🚀 Demo en Vivo

**URL:** https://executiveperformancek-fd430.web.app

---

## 📋 Stack Tecnológico

### Frontend
- HTML5 + CSS3 (2300+ líneas)
- JavaScript ES6+ (3000+ líneas)
- Chart.js para gráficos
- Firebase SDK

### Backend
- Node.js v24+
- Express.js v4.18+
- Firebase Admin SDK v11+

### Base de Datos
- Firebase Firestore
- Firebase Authentication
- 2 índices compuestos

---

## 🛠️ Instalación

### Requisitos
- Node.js v20+
- npm v10+
- Cuenta Firebase

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/TeamInfinixDev/executive-performance-crm.git
cd executive-performance-crm
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Firebase**
- Crear proyecto en Firebase Console
- Descargar archivo de configuración
- Guardar como `firebase-config.js`

4. **Ejecutar localmente**
```bash
npm start
```

5. **Deployar a Firebase**
```bash
firebase deploy
```

---

## 📁 Estructura del Proyecto

```
firebase-web-app/
├── public/
│   ├── index.html (App principal)
│   ├── login.html (Login)
│   ├── admin.html (Panel Admin)
│   ├── css/
│   │   └── style.css (2300+ líneas)
│   └── js/
│       ├── auth.js
│       ├── clients.js
│       ├── dashboard.js
│       ├── admin-panel.js
│       ├── sales-tracking.js
│       └── más...
├── src/
│   ├── index.js (Servidor Express)
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   └── services/
├── functions/
│   └── index.js (Cloud Functions)
├── firebase.json
├── firestore.rules
└── firestore.indexes.json
```

---

## 🔐 Variables de Entorno

Crear `.env`:

```
FIREBASE_API_KEY=tu_key_aqui
FIREBASE_AUTH_DOMAIN=proyecto.firebaseapp.com
FIREBASE_DATABASE_URL=https://proyecto.firebaseio.com
FIREBASE_PROJECT_ID=proyecto-id
FIREBASE_STORAGE_BUCKET=proyecto.appspot.com
```

---

## 📊 8 Tabs Funcionales

1. **Mis Clientes** - CRUD de clientes con búsqueda y filtros
2. **Dashboard** - Métricas en tiempo real
3. **Metas** - Seguimiento de objetivos de ventas
4. **Pipeline** - Gestión de oportunidades (5 estados)
5. **Contactos** - Reportes de contactos
6. **Campañas** - Campañas masivas por segmento
7. **Actividades** - Timeline de actividades
8. **Recordatorios** - Gestión de tareas

---

## 🎯 Sistema de Ventas

El sistema automáticamente registra:
- Tipos: nuevo_cliente, upgrade, downgrade, renovación
- Fecha y monto
- Cliente asociado
- Genera metas actualizadas

---

## 🔐 Seguridad

- Firebase Rules en producción
- Control de acceso por roles
- Autenticación con email/password
- Validación en frontend y backend
- HTTPS/SSL automático

---

## 📈 Estadísticas

- **Total usuarios:** 4+ (extensible)
- **Total clientes demo:** 12+
- **Líneas de código:** 5000+
- **Archivos JavaScript:** 10+
- **Índices Firestore:** 2
- **Firestore Collections:** 5

---

## 🐛 Solución de Problemas

### Error: "Usuario no encontrado en el sistema"
```bash
node fix-missing-users.js
```

### Error: "Email ya está registrado"
```bash
node cleanup-user-auth.js email@example.com
```

### Limpiar usuario completamente
```bash
node cleanup-user.js email@example.com
```

---

## 📝 Licencia

```
Licencia: LIC-INFINIX-2024-EP-001
Propietario: Infinix Dev
Cliente: ICE (Instituto Costarricense de Electricidad)
Año: 2024
Tipo: Comercial - Uso exclusivo
```

---

## 👨‍💼 Creador

**Rubén Madrigal**  
*Arquitecto de Soluciones Tecnológicas*

**Empresa:** [Infinix Dev](https://infinixdev.com)  
**Lema:** Solutions that transform

---

## 🤝 Contacto

- 📧 Email: info@infinixdev.com
- 🌐 Web: https://infinixdev.com
- 👤 LinkedIn: [Rubén Madrigal]
- 🐙 GitHub: [@TeamInfinixDev](https://github.com/TeamInfinixDev)

---

## 📚 Documentación Adicional

Ver carpeta `/docs/` para:
- `INSTALL.md` - Guía de instalación paso a paso
- `DEPLOYMENT.md` - Guía de deployment
- `API.md` - Documentación de API
- `TROUBLESHOOTING.md` - Solución de problemas

---

**Made with ❤️ by Infinix Dev**

🚀 Executive Performance CRM v1.0 - 2024
```

Luego en PowerShell:

```powershell
git add README.md
git commit -m "📝 Add comprehensive README"
git push
```

---

## ✅ ¡LISTO!

Tu proyecto estará en:
👉 https://github.com/TeamInfinixDev/executive-performance-crm

---

**¿Necesitas ayuda con algún paso?** 👇
