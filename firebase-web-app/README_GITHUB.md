# 🎯 Executive Performance CRM

[![Made by Infinix Dev](https://img.shields.io/badge/Made%20by-Infinix%20Dev-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHJ4PSI0IiBmaWxsPSJibGFjayIvPjwvc3ZnPg==)](https://infinixdev.com)
[![License](https://img.shields.io/badge/License-LIC--INFINIX--2024--EP--001-green?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)](package.json)
[![Firebase](https://img.shields.io/badge/Firebase-Production-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com)
[![Node.js](https://img.shields.io/badge/Node.js-v24+-green?style=for-the-badge&logo=node.js)](https://nodejs.org)

**Plataforma profesional de gestión de clientes y seguimiento de ventas** 🚀

Desarrollada por **Infinix Dev** para **ICE (Instituto Costarricense de Electricidad)**

> *Solutions that transform* ✨

---

## 📸 Vista Previa

**Dashboard en vivo:** https://executiveperformancek-fd430.web.app

---

## ✨ Características Principales

### 📊 8 Tabs Funcionales

| Tab | Descripción |
|-----|-------------|
| **Mis Clientes** | CRUD completo con búsqueda, filtros y paginación |
| **Dashboard** | Métricas en tiempo real con gráficos Chart.js |
| **Metas** | Seguimiento de objetivos y ventas por segmento |
| **Pipeline** | Gestión de oportunidades (5 estados) |
| **Contactos** | Reportes con filtros avanzados |
| **Campañas** | Campañas masivas por segmento |
| **Actividades** | Timeline completo de eventos |
| **Recordatorios** | Gestión de tareas con persistencia |

### 🔥 Sistema Automático de Ventas

```
Cliente → Se crea venta automática → Actualiza metas → Genera reportes
```

- ✅ Tipos: nuevo_cliente, upgrade, downgrade, renovación
- ✅ Sincronización en tiempo real
- ✅ Histórico completo
- ✅ Reportes por período

### 🔐 Seguridad Empresarial

- ✅ Firebase Authentication con email/password
- ✅ Control de acceso por roles (Admin/Executive)
- ✅ Firestore Security Rules en producción
- ✅ HTTPS/SSL automático
- ✅ Validación frontend + backend

### 📱 Diseño Responsivo

- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (480px - 767px)
- ✅ Mini (< 480px)
- ✅ Apple iOS 26 minimalista

---

## 🛠️ Stack Tecnológico

### Frontend
```
HTML5 + CSS3 (2300+ líneas) + JavaScript ES6+ (3000+ líneas)
```
- Chart.js para gráficos
- Firebase SDK v10.7.1
- XLSX para exportación Excel
- localStorage para persistencia

### Backend
```
Node.js v24+ + Express.js v4.18+
```
- Firebase Admin SDK v11.11.0
- CORS habilitado
- Middleware de autenticación
- Manejo de errores centralizado

### Base de Datos
```
Firebase Firestore (Cloud Database)
```
- 5 collections: users, clients, ventas, activities, campaigns
- 2 índices compuestos
- Security Rules en producción
- Backups automáticos

### Hosting
```
Firebase Hosting (CDN Global)
```
- SSL/HTTPS automático
- Deploy automático
- Analytics incluido

---

## 🚀 Quick Start

### Requisitos
- Node.js v20+
- npm v10+
- Cuenta Firebase
- Git

### Instalación (3 pasos)

```bash
# 1. Clonar
git clone https://github.com/TeamInfinixDev/executive-performance-crm.git
cd executive-performance-crm/firebase-web-app

# 2. Instalar dependencias
npm install

# 3. Ejecutar
npm start
```

**App abierta en:** http://localhost:3000

### Deploy a Producción

```bash
# 1. Login en Firebase
firebase login

# 2. Deploy
firebase deploy --only hosting

# 3. App en vivo
https://executiveperformancek-fd430.web.app
```

---

## 📁 Estructura del Proyecto

```
executive-performance-crm/
│
├── 📄 README.md (este archivo)
├── 📄 SUBIR_A_GITHUB.md (guía de deployment)
├── 📄 DEPLOY_PRODUCCION.md (guía completa)
│
├── firebase-web-app/
│   ├── 📂 public/ (Frontend)
│   │   ├── index.html (App principal - 631 líneas)
│   │   ├── login.html (Login)
│   │   ├── admin.html (Panel Admin)
│   │   ├── 📂 css/
│   │   │   └── style.css (2300+ líneas, responsive)
│   │   └── 📂 js/
│   │       ├── auth.js (Autenticación)
│   │       ├── clients.js (Gestión de clientes)
│   │       ├── dashboard.js (Métricas)
│   │       ├── admin-panel.js (Admin)
│   │       ├── sales-tracking.js (Ventas)
│   │       ├── advanced-features.js (Features)
│   │       └── más...
│   │
│   ├── 📂 src/ (Backend)
│   │   ├── index.js (Servidor Express)
│   │   ├── 📂 config/
│   │   ├── 📂 controllers/
│   │   ├── 📂 middleware/
│   │   ├── 📂 routes/
│   │   └── 📂 services/
│   │
│   ├── 📂 functions/ (Cloud Functions - opcional)
│   │   ├── index.js (Triggers)
│   │   └── package.json
│   │
│   ├── firebase.json (Configuración Firebase)
│   ├── firestore.rules (Security Rules)
│   ├── firestore.indexes.json (Índices)
│   ├── package.json (Dependencias)
│   │
│   └── 📂 Scripts útiles/
│       ├── fix-missing-users.js (Sincronizar usuarios)
│       ├── cleanup-user-auth.js (Limpiar usuarios)
│       ├── sync-user.js (Forzar sincronización)
│       └── más...
│
└── 📂 docs/ (Documentación)
    ├── INSTALACION.md
    ├── DEPLOYMENT.md
    ├── TROUBLESHOOTING.md
    └── más...
```

---

## 🔧 Scripts Disponibles

```bash
npm start              # Inicia servidor en http://localhost:3000
npm test              # Ejecuta tests (si están configurados)
firebase deploy       # Deploy a Firebase Hosting
firebase deploy --only hosting   # Solo frontend
firebase deploy --only functions # Solo Cloud Functions
```

### Scripts de Mantenimiento

```bash
# Sincronizar usuarios faltantes
node fix-missing-users.js

# Limpiar un usuario de Authentication
node cleanup-user-auth.js email@example.com

# Sincronizar usuario específico
node sync-user.js email@example.com

# Verificar admin
node verify-admin.js
```

---

## 📊 Estadísticas del Proyecto

| Métrica | Cantidad |
|---------|----------|
| **Líneas de código** | 5000+ |
| **Archivos JavaScript** | 10 |
| **Líneas CSS** | 2300+ |
| **Archivos HTML** | 4 |
| **Documentación** | 20+ archivos .md |
| **Firestore Collections** | 5 |
| **Firestore Indexes** | 2 compuestos |
| **Tabs funcionales** | 8 |
| **Usuarios demo** | 4+ |
| **Clientes demo** | 12+ |

---

## 🎯 Casos de Uso

✅ **Gestión de Clientes**
- Crear, editar, eliminar clientes
- Segmentación (PLATINO, ORO, PLATA, BRONCE)
- Búsqueda y filtros avanzados
- Paginación flexible

✅ **Seguimiento de Ventas**
- Registro automático de tipos de venta
- Histórico completo
- Metas por segmento
- Reportes en tiempo real

✅ **Análisis de Datos**
- Dashboard con métricas
- Gráficos interactivos
- Exportación a Excel
- Filtraje avanzado

✅ **Gestión de Equipos**
- Control de acceso por roles
- Asignación de tareas
- Timeline de actividades
- Recordatorios personalizados

---

## 🔐 Seguridad

### Autenticación
```javascript
Firebase Authentication
├── Email/Password
├── 2FA optional
└── Session management
```

### Autorización
```
Admin → Acceso completo al panel de administración
Executive → Acceso a datos propios + reportes generales
```

### Firestore Rules
```javascript
// Solo usuarios autenticados pueden acceder
// Admin puede ver todos los datos
// Executive solo ve datos propios
```

### HTTPS/SSL
```
✅ Automático con Firebase Hosting
✅ Certificado válido
✅ Renovación automática
```

---

## 📈 Performance

- ⚡ **Carga inicial:** < 2 segundos
- ⚡ **Dashboard:** Render en tiempo real
- ⚡ **Búsqueda:** Indexada en Firestore
- ⚡ **CDN:** Global con Firebase Hosting
- ⚡ **Cache:** LocalStorage + Browser Cache

---

## 🐛 Solución de Problemas

### Problema: "Usuario no encontrado en el sistema"

**Solución:**
```bash
node fix-missing-users.js
```

### Problema: "Email ya está registrado"

**Solución:**
```bash
node cleanup-user-auth.js email@example.com
# Esperar 5-10 minutos
# Intentar de nuevo
```

### Problema: "No puedo acceder al admin panel"

**Solución:**
1. Verificar que el usuario tenga role `admin` en Firestore
2. Ejecutar: `node verify-admin.js`
3. Si falta, agregar manualmente en Firebase Console

### Problema: "Las metas no se actualizan"

**Solución:**
1. Verificar que Firestore índice esté habilitado (verde)
2. Crear una venta nueva
3. Refrescar página (F5)

### Más ayuda
👉 Ver `TROUBLESHOOTING.md`

---

## 📚 Documentación

- 📖 [INSTALACION.md](firebase-web-app/INSTRUCCIONES_INSTALACION.md) - Guía paso a paso
- 📖 [DEPLOYMENT.md](firebase-web-app/DEPLOY_PRODUCCION.md) - Cómo deployar
- 📖 [GUIA_VALIDACION.md](firebase-web-app/GUIA_VALIDACION.md) - Testing
- 📖 [CREDITOS.md](firebase-web-app/CREDITOS.md) - Información del proyecto

---

## 🤝 Contribuir

Este es un proyecto comercial. Para contribuir:

1. 🍴 Fork el repositorio
2. 🌿 Crea una rama (`git checkout -b feature/amazing-feature`)
3. 📝 Commit cambios (`git commit -m 'Add amazing feature'`)
4. 📤 Push a la rama (`git push origin feature/amazing-feature`)
5. 🔔 Abre un Pull Request

**Contacta a:** info@infinixdev.com

---

## 📝 Licencia

```
Licencia: LIC-INFINIX-2024-EP-001
Propietario: Infinix Dev
Cliente: ICE (Instituto Costarricense de Electricidad)
Año: 2024
Tipo: Comercial - Uso exclusivo para ICE
```

**Términos:**
- Uso exclusivo por ICE
- No distribuible sin consentimiento
- Soporte técnico incluido por 12 meses
- Renovación anual requerida

---

## 👨‍💼 Creador

**Rubén Madrigal**  
*Arquitecto de Soluciones Tecnológicas*

### Infinix Dev
> Solutions that transform

- 🌐 **Web:** https://infinixdev.com
- 📧 **Email:** info@infinixdev.com
- 🐙 **GitHub:** [@TeamInfinixDev](https://github.com/TeamInfinixDev)
- 📍 **Ubicación:** Costa Rica

---

## 🙏 Agradecimientos

- ✨ **Firebase** por su infraestructura confiable
- 🏢 **ICE** por confiar en nosotros
- 💻 **Comunidad Open Source** por las herramientas
- 👥 **Team Infinix Dev** por el soporte

---

## 📞 Soporte

¿Preguntas o problemas?

1. 📖 Revisa la [documentación](firebase-web-app/)
2. 🐛 Abre un [Issue](https://github.com/TeamInfinixDev/executive-performance-crm/issues)
3. 📧 Contacta: info@infinixdev.com

---

## 🎉 Changelog

### v1.0.0 (Noviembre 2024)
✅ Release inicial  
✅ 8 tabs completamente funcionales  
✅ Sistema automático de ventas  
✅ Dashboards con métricas en tiempo real  
✅ Control de acceso por roles  
✅ Documentación completa  
✅ Production ready  

---

## 📊 Estado del Proyecto

| Aspecto | Estado |
|---------|--------|
| **Funcionalidad** | ✅ 100% |
| **Seguridad** | ✅ 100% |
| **Performance** | ✅ Optimizado |
| **Documentación** | ✅ Completa |
| **Testing** | ✅ Pasado |
| **Production** | ✅ Live |

---

## 🔮 Roadmap

- [ ] App móvil nativa (React Native)
- [ ] Integraciones con CRM externos
- [ ] IA para predicción de ventas
- [ ] Notificaciones push
- [ ] Sincronización offline
- [ ] Multi-idioma
- [ ] API pública

---

**Made with ❤️ by Infinix Dev**

```
    ∞
  Infinix
    Dev
```

🚀 **Executive Performance CRM v1.0 - 2024**

---

*Última actualización: Noviembre 10, 2025*
