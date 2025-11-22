# 📦 Sistema de Seguimiento de Pedidos - Documentación

## Descripción General

El **Sistema de Seguimiento de Pedidos (Seguimiento de Pedidos)** es un módulo integrado que permite a los ejecutivos registrar, monitorear y gestionar pedidos con notificaciones automáticas de 24 horas para pedidos pendientes.

## Características

✅ **Registro de Pedidos**
- Número de pedido (formato: KO-XXXXXXX o 1-XXXXXXXXX)
- IMEI o código de accesorio
- Tipo de plataforma (KOMERCIAL/SIEBEL)
- Nombre del cliente (opcional)
- Timestamp automático

✅ **Gestión de Estado**
- Estados: PENDIENTE, ENVIADO
- Marcar pedido como enviado con un clic
- Cambios en tiempo real

✅ **Métricas Automáticas**
- Contador de pedidos pendientes
- Contador de pedidos enviados
- Total de pedidos registrados
- Actualizaciones en tiempo real

✅ **Visualización de Datos**
- Gráfico de estado (Donut) - Pendientes vs Enviados
- Gráfico de pedidos por día (Línea) - Últimos 7 días
- Ambos gráficos son expandibles

✅ **Reminders Automáticos de 24h**
- Verifica cada hora si hay pedidos pendientes >24h
- Notificaciones visuales en la interfaz
- Sigue un máximo de recordatorios por pedido

✅ **Aislamiento de Datos**
- Cada usuario ve solo sus pedidos
- Acceso controlado por Firestore Rules
- IDs de usuario como identificador principal

## Estructura de Archivos

```
public/
├── js/
│   ├── orders-tracking.js          # Lógica de datos y cálculos
│   ├── orders-management.js        # UI y eventos
│   └── test-orders-system.js       # Pruebas del sistema
├── css/
│   └── orders-styles.css           # Estilos Apple design
└── index.html                       # Tab de Seguimiento de Pedidos
```

## Módulo: orders-tracking.js

### Clase: OrdersTracking

**Constructor:**
```javascript
const tracker = new OrdersTracking();
```

**Métodos Principales:**

| Método | Descripción |
|--------|-------------|
| `init(userId)` | Inicializar con ID de usuario |
| `registerOrder(orderData)` | Registrar nuevo pedido |
| `markOrderAsSent(orderId)` | Marcar como enviado |
| `calculateMetrics()` | Calcular métricas automáticamente |
| `getOrdersForCharts()` | Datos para gráficos |
| `getPendingReminders()` | Pedidos pendientes >24h |
| `getAllOrders()` | Lista completa de pedidos |
| `getMetrics()` | Retorna métricas actuales |

**Datos de Orden:**
```javascript
{
    id: "doc-id",
    userId: "user-uid",
    orderNumber: "KO-50734124",
    imei: "123456789",
    type: "KOMERCIAL", // or "SIEBEL"
    client: "Nombre del cliente",
    status: "PENDIENTE", // or "ENVIADO"
    timestamp: Date,
    date: "2024-01-15",
    createdAt: 1234567890000,
    lastReminderAt: 1234567890000,
    reminderCount: 0
}
```

## Módulo: orders-management.js

**Funciones Globales:**

| Función | Descripción |
|---------|-------------|
| `initOrdersManagement(userId)` | Inicializa UI y listeners |
| `updateOrdersMetrics()` | Actualiza números en pantalla |
| `renderOrdersCharts()` | Redibuja gráficos |
| `renderOrdersList()` | Actualiza lista de pedidos |
| `markOrderAsSent(orderId)` | Marca pedido como enviado |
| `listenToOrdersUpdates()` | Real-time Firestore listener |

## Estilos CSS (orders-styles.css)

### Componentes:

1. **Stats Grid** (.orders-stats-grid)
   - 3 columnas responsive
   - Gradient background
   - Hover effects

2. **Form Container** (.orders-form-container)
   - Grid layout 2 columnas
   - Focus effects en inputs
   - Botones accent colors

3. **Charts Container** (.charts-container)
   - 2 columnas expandible
   - Hover effects
   - Icon de expansión

4. **Orders List** (#ordersList)
   - Cards animadas
   - Status badges
   - Botones de acción

## Integración en index.html

### CSS
```html
<link rel="stylesheet" href="css/orders-styles.css">
```

### JavaScript
```html
<script src="js/orders-tracking.js"></script>
<script src="js/orders-management.js"></script>
```

### Inicialización (en auth.js)
```javascript
if (typeof initOrdersManagement === 'function') {
    initOrdersManagement(user.uid);
}

if (typeof listenToOrdersUpdates === 'function') {
    listenToOrdersUpdates();
}
```

## Seguridad en Firestore

**Colección: orders**

```
READ:  Usuario puede leer solo sus pedidos (userId == request.auth.uid)
       Admins pueden leer todos
       
CREATE: Usuario crea solo sus pedidos (userId == request.auth.uid)

UPDATE: Usuario actualiza solo sus pedidos (userId == request.auth.uid)

DELETE: Usuario elimina solo sus pedidos (userId == request.auth.uid)

WRITE:  Solo admins
```

## Flujo de Uso

### 1. Usuario se autentica
```
Login → Auth → uid almacenado
```

### 2. Inicialización automática
```
App cargada → initOrdersManagement(uid)
              → Cargar pedidos de Firestore
              → Render UI
              → Iniciar listener tiempo real
```

### 3. Registrar pedido
```
Llenar forma → Click "Registrar Pedido"
            → registerOrder()
            → Guardar en Firestore
            → Actualizar UI
            → Re-renderizar gráficos
```

### 4. Marcar como enviado
```
Click botón "Marcar Enviado"
         → markOrderAsSent(orderId)
         → Update Firestore
         → Recalcular métricas
         → Update UI
```

### 5. Verificar reminders (Cada hora)
```
startReminderCheck()
    → Verificar pedidos >24h
    → Mostrar notificación
    → Actualizar lastReminderAt
```

## Formato de Orden

### Número de Pedido
Formato aceptado:
- `KO-50734124` (Komercial)
- `1-10245886908` (Siebel)
- Personalizable en validación

### IMEI
- 15 dígitos típicamente
- Puede ser código de accesorio
- Campo obligatorio

### Tipo
```
KOMERCIAL - Para pedidos de plataforma KO
SIEBEL    - Para pedidos de plataforma SB
```

## Estadísticas Automáticas

### Métricas Calculadas
- **Pendientes**: Conteo de status == 'PENDIENTE'
- **Enviados**: Conteo de status == 'ENVIADO'
- **Total**: Suma de todos

### Gráficos

**Estado (Donut)**
- Datos: [Pendientes, Enviados]
- Colores: [#FF6B6B (rojo), #4ECDC4 (teal)]

**Por Día (Línea)**
- Eje X: Últimos 7 días (Dom-Sab)
- Eje Y: Conteo de pedidos
- Línea: #6366F1 (indigo)

## Notificaciones

### Reminder de 24h
Trigger: Pedido pendiente por >24 horas

```javascript
// Se verifica cada hora
if (timeSinceCreation > 24h && timeSinceLastReminder > 24h) {
    showReminder()
}
```

Muestra:
```
🔔 Recordatorio: Pedido KO-50734124 pendiente por más de 24h
```

## Pruebas

### Ejecutar pruebas
```javascript
// En consola del navegador
testOrdersTracking()
```

Verifica:
- Clases y funciones existen
- Elementos DOM presentes
- Estilos CSS cargados
- Gráficos Canvas
- Formulario funcional

### Script de prueba
`public/js/test-orders-system.js`

Acceder con:
```
URL?test=orders
```

## Troubleshooting

### Problema: No aparecen pedidos
**Solución:**
- Verificar que Firestore rules están actualizadas
- Confirmar userId correcto
- Ver consola para errores

### Problema: Gráficos no se renderizan
**Solución:**
- Confirmar Chart.js está cargado
- Verificar canvas tiene ID correcto
- Ver consola de errores

### Problema: No se guardan pedidos
**Solución:**
- Verificar conectividad Firebase
- Revisar Firestore rules
- Confirmar usuario autenticado

## Performance

- Carga inicial: ~200ms
- Reminder check: Cada hora (bajo impacto)
- Real-time updates: Instantáneo
- Charts render: ~500ms

## Future Enhancements

- [ ] Exportar reporte de pedidos
- [ ] Filtrar por rango de fechas
- [ ] Búsqueda por número de pedido
- [ ] Notificaciones push
- [ ] Integración con sistemas externos (KO/Siebel)
- [ ] Historial de cambios
- [ ] Multi-user collaboration

## API de Programación

### Acceso global
```javascript
window.OrdersTracking        // Clase
window.initOrdersManagement  // Función
window.listenToOrdersUpdates // Función
window.markOrderAsSent       // Función
window.testOrdersTracking    // Función pruebas
```

### Ejemplo: Acceso manual
```javascript
// Crear instancia
const tracker = new OrdersTracking();
await tracker.init('user-uid');

// Registrar
await tracker.registerOrder({
    orderNumber: 'KO-123456',
    imei: '123456789',
    type: 'KOMERCIAL',
    client: 'Cliente XYZ'
});

// Obtener métricas
const metrics = tracker.getMetrics();
console.log(metrics.pendingCount);
```

## Versión
v1.0 - Implementación inicial

## Última actualización
[Fecha del deploy]
