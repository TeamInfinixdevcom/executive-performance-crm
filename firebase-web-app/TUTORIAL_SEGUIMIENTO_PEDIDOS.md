# 📚 Tutorial: Sistema de Seguimiento de Pedidos

## Introducción

El sistema de **Seguimiento de Pedidos** (antes pestaña "Contactos") permite a los ejecutivos registrar y monitorear el estado de los pedidos en tiempo real, con reminders automáticos después de 24 horas.

---

## 🚀 Comenzar

### 1. Acceder al Sistema

Después de iniciar sesión, haz clic en la pestaña **📦 Seguimiento de Pedidos** en el menú principal.

```
┌─────────────────────────────────┐
│ 📊 Dashboard │ 📞 Llamadas │ 📦 Seguimiento de Pedidos │ ...
└─────────────────────────────────┘
```

### 2. Interfaz Principal

La pestaña está dividida en 4 secciones:

```
┌────────────────────────────────────────────┐
│                                            │
│  📊 Seguimiento de Pedidos                 │
│                                            │
│  ┌─────────────┬──────────┬──────────────┐ │
│  │ ⏳ Pendientes│✅ Enviados│📊 Total     │ │
│  │      5      │    12    │     17      │ │
│  └─────────────┴──────────┴──────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  📝 Registrar Nuevo Pedido            │  │
│  │  [Campos de formulario...]            │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  📊 Análisis de Pedidos                    │
│  ┌───────────────────┬───────────────────┐ │
│  │ Estado de Pedidos │ Pedidos por Día   │ │
│  │   [Gráfico]       │    [Gráfico]      │ │
│  └───────────────────┴───────────────────┘ │
│                                            │
│  📋 Últimos Pedidos                        │
│  ┌───────────────────────────────────────┐ │
│  │ KO-50734124  IMEI: 123456...          │ │
│  │ ⏳ Pendiente  [Marcar Enviado]         │ │
│  └───────────────────────────────────────┘ │
│                                            │
└────────────────────────────────────────────┘
```

---

## 📝 Registrar un Pedido

### Paso 1: Completar Formulario

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **Número de Pedido** * | Código único | `KO-50734124` o `1-10245886908` |
| **IMEI / Accesorio** * | Código del dispositivo | `123456789012345` |
| **Tipo de Plataforma** * | Sistema destino | KOMERCIAL o SIEBEL |
| **Cliente** | Nombre del cliente | Opcional |

*Campos obligatorios

### Paso 2: Verificar Datos

```
Ejemplo 1 (Komercial):
┌─────────────────────────────────┐
│ Número: KO-50734124             │
│ IMEI:   356938109242800         │
│ Tipo:   KOMERCIAL               │
│ Cliente: (dejar en blanco)      │
└─────────────────────────────────┘

Ejemplo 2 (Siebel):
┌─────────────────────────────────┐
│ Número: 1-10245886908           │
│ IMEI:   A1B2C3D4E5F6            │
│ Tipo:   SIEBEL                  │
│ Cliente: Nombre del Cliente     │
└─────────────────────────────────┘
```

### Paso 3: Enviar

Haz clic en el botón **📦 Registrar Pedido** (botón verde)

```
✅ Resultado: Pedido registrado correctamente
```

El pedido aparecerá en:
- ✅ Lista de pedidos al fondo
- ✅ Contador "Pedidos Pendientes" aumentará
- ✅ Gráficos se actualizarán automáticamente

---

## 📊 Entender los Gráficos

### Gráfico 1: Estado de Pedidos (Donut)

**Qué muestra:**
- Proporción de pedidos PENDIENTES vs ENVIADOS
- Colores: 🔴 Rojo (Pendientes) | 🟢 Verde (Enviados)

**Ejemplo:**
```
Estado de Pedidos
    Pendientes: 5 (28%)
    Enviados:  12 (72%)
    
    Visualización:
    ┌─────────────────┐
    │  ╮╭╭╭╭╭        │  28% Rojo
    │ ╰               │  72% Verde
    └─────────────────┘
```

**Usar para:** Saber qué porcentaje de pedidos están pendientes vs completados

### Gráfico 2: Pedidos por Día (Línea)

**Qué muestra:**
- Tendencia de registro de pedidos últimos 7 días
- Eje X: Día de la semana (Dom-Sab)
- Eje Y: Cantidad de pedidos

**Ejemplo:**
```
Pedidos por Día
        │
      8 ├──────●
        │    ╱   ╲
      6 ├──●       ●─────
        │       ╲   ╱
      4 ├────────●╱
        │
      2 ├─●
        │
      0 └───┴───┴───┴───┴───┴───┴───
          Dom Lun Mar Mié Jue Vie Sab
```

**Usar para:** Identificar patrones de actividad y picos de registro

### 🔍 Expandir Gráficos

Si deseas ver un gráfico más grande:

1. Haz hover sobre el gráfico
2. Verás un ícono **⛶** en la esquina superior derecha
3. Haz clic para expandir
4. Se abrirá en modo pantalla completa

---

## ✅ Marcar Pedido como Enviado

### Paso 1: Localizar Pedido

En la sección "📋 Últimos Pedidos" busca el pedido en estado ⏳ Pendiente

```
KO-50734124  IMEI: 356938109242800
⏳ Pendiente   [Marcar Enviado]
```

### Paso 2: Hacer Clic

Haz clic en el botón **Marcar Enviado**

```
✅ Resultado: Pedido marcado como enviado
```

### Paso 3: Verificar

El pedido ahora mostrará:
```
KO-50734124  IMEI: 356938109242800
✅ Enviado
```

Y se actualizarán:
- ⏳ Pedidos Pendientes: -1
- ✅ Pedidos Enviados: +1
- Gráficos en tiempo real

---

## 🔔 Recordatorios Automáticos

### ¿Cómo funcionan?

El sistema **verifica cada hora** si hay pedidos pendientes desde hace más de 24 horas.

**Línea de tiempo:**

```
Hora 0:  Registras pedido KO-50734124
         Estado: PENDIENTE
         ⏳ Cuenta regresiva: 24h

Hora 24: Sistema detecta: "Este pedido tiene 24h"
         🔔 Mostrar: Recordatorio de 24h

Hora 25-48: Pedido sigue pendiente
            No muestra recordatorio (solo 1 cada 24h)

Hora 48: Nuevo recordatorio si sigue pendiente
         🔔 Mostrar: Recordatorio de 48h (nuevo)
```

### Cuando ves un Recordatorio

Si ves:
```
🔔 Recordatorio: Pedido KO-50734124 pendiente por más de 24h
```

**Significa:**
- El pedido está PENDIENTE desde hace ≥ 24 horas
- No se ha marcado como ENVIADO
- Debes verificar si fue enviado a KOMERCIAL o SIEBEL

**Qué hacer:**
1. ✅ Si fue enviado: Haz clic en "Marcar Enviado"
2. ❌ Si no fue enviado: Investiga por qué
3. 🆘 Si hay problema: Contacta a administrador

---

## 📋 Lista de Pedidos

### Información Mostrada

Cada pedido en la lista muestra:

```
┌────────────────────────────────────────────┐
│ KO-50734124 (KOMERCIAL)                    │
│ IMEI: 356938109242800                      │
│ Registrado: 2024-01-15 14:30 • hace 2h     │
│ ⏳ Pendiente   [Marcar Enviado]           │
└────────────────────────────────────────────┘
```

**Datos:**
- Número de pedido con tipo (entre paréntesis)
- IMEI o código de accesorio
- Fecha y hora exacta
- Tiempo transcurrido (hace Xh, hace Xm)
- Estado actual con badge de color
- Botón de acción (si está PENDIENTE)

### Ordenamiento

Los pedidos se muestran en orden **RECIENTE PRIMERO** (más nuevos arriba)

---

## 🔄 Actualizaciones en Tiempo Real

### Cómo funciona

Tu navegador está conectado a la base de datos de Firebase. Cualquier cambio se refleja automáticamente:

**Escenario:**
```
Tu navegador          Otro usuario
    │                      │
    │ Registra KO-123  →   │
    │                      │
    │ ← Sistema notifica   │
    │                      │
[Se actualiza lista] [Se actualiza lista]
```

**Ventajas:**
- ✅ No necesitas refrescar
- ✅ Si otro ejecutivo marca un pedido, lo ves al instante
- ✅ Métricas siempre actualizadas
- ✅ Gráficos cambian automáticamente

---

## 💾 Dónde se guardan los datos

Todos los pedidos se guardan automáticamente en **Firebase Firestore** (nube):

```
Base de Datos
└── orders (colección)
    ├── Doc 1: KO-50734124 (Tu usuario)
    ├── Doc 2: 1-10245886908 (Tu usuario)
    └── Doc 3: KO-ABC (Otro usuario)
```

**Seguridad:**
- ✅ Solo TÚ ves tus pedidos
- ✅ Otros usuarios NO pueden ver tus pedidos
- ✅ Los admins pueden ver todos los pedidos
- ✅ Datos encriptados en tránsito

---

## 🎯 Casos de Uso

### Caso 1: Seguimiento de un equipo

```
Ejecutivo A: Registra 3 pedidos KO
Ejecutivo B: Registra 2 pedidos Siebel

Admin: Ve todos (5 total) en reportes
```

### Caso 2: Investigación de retrasos

```
Ves recordatorio: "Pedido pendiente hace 24h"
    ↓
Verificas: ¿Fue enviado a KOMERCIAL?
    ↓
No encontrado → Contacta a soporte
    ↓
Soporte investiga → Encuentra el error
    ↓
Se reenvia → Marcas como enviado
```

### Caso 3: Reporte de performance

```
Abres Sistema de Seguimiento de Pedidos
    ↓
Ves gráfico: "80% pedidos enviados en 24h"
    ↓
Puedes reportar: "Alta eficiencia"
```

---

## ❓ Preguntas Frecuentes

### P: ¿Qué pasa si no marca como enviado?
**R:** El sistema seguirá considerándolo PENDIENTE y enviará recordatorio cada 24h.

### P: ¿Puedo editar un pedido registrado?
**R:** Por el momento no, pero puedes contactar a administrador para cambios.

### P: ¿Puedo eliminar un pedido?
**R:** No desde la interfaz, contacta a administrador si es necesario.

### P: ¿A qué hora se verifica el recordatorio?
**R:** Cada hora en punto, en cualquier momento del día.

### P: ¿Qué pasa si cierro sesión?
**R:** Los datos se guardan en la nube. Al volver a entrar verás todo igual.

### P: ¿Puedo ver pedidos de otros ejecutivos?
**R:** No, cada usuario solo ve sus propios pedidos. Admins ven todos.

### P: ¿El IMEI debe tener exactamente 15 dígitos?
**R:** Puede ser cualquier código, no tiene que ser exactamente 15 (ej: códigos de accesorios).

---

## 🔧 Troubleshooting

### Problema: No aparecen mis pedidos

**Soluciones:**
1. Recarga la página: F5
2. Verifica conexión a internet
3. Cierra sesión y vuelve a entrar
4. Contacta a soporte

### Problema: Gráficos están en blanco

**Soluciones:**
1. Verifica que tienes al menos 1 pedido registrado
2. Recarga la página
3. Abre consola del navegador: F12
4. Busca mensajes de error

### Problema: El botón "Registrar Pedido" no funciona

**Soluciones:**
1. Verifica que completaste TODOS los campos marcados con *
2. Verifica que el Número de Pedido tiene formato válido
3. Intenta nuevamente
4. Si persiste: Contacta a soporte

### Problema: No veo recordatorios

**Soluciones:**
1. Verifica que tienes pedidos pendientes hace >24h
2. Ten abierta la pestaña de Seguimiento de Pedidos
3. Espera hasta la próxima hora en punto
4. Verifica que las notificaciones están habilitadas

---

## 📱 Acceso desde Dispositivos

### Desktop (Recomendado)
```
✅ Mejor experiencia
✅ Gráficos más grandes
✅ Formulario completo
```

### Tablet
```
✅ Bien soportado
⚠️ Algunos gráficos pueden ser pequeños
```

### Mobile
```
⚠️ Funciona pero no optimizado
⚠️ Es mejor usar Desktop para registrar
✅ Puedes ver lista desde móvil
```

---

## 💡 Consejos

1. **Registra pedidos inmediatamente** - Evita olvidar
2. **Verifica estado regularmente** - No esperes al recordatorio
3. **Actualiza estado ASAP** - No dejes pedidos en "PENDIENTE" innecesariamente
4. **Usa nombres de clientes** - Ayuda a identificar pedidos rápidamente
5. **Revisa gráficos semanalmente** - Identifica patrones

---

## 📞 Soporte

Si encuentras problemas:

1. **Consola de Navegador**: Presiona F12 → Pestaña "Console"
2. **Pruebas del Sistema**: Abre consola y ejecuta `testOrdersTracking()`
3. **Contactar Admin**: Proporciona screenshots o mensajes de error

---

**¡Listo para usar el Sistema de Seguimiento de Pedidos!** 🎉
