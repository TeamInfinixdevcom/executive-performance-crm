# ✅ GUÍA DE VALIDACIÓN - Executive Performance CRM

## Funcionalidades con Paginación y Filtros

### 1. 👥 MIS CLIENTES
- **Paginación:** 5/10/20/50 items por página
- **Filtros:** Por segmento (PLATINO, ORO, PLATA, BRONCE)
- **Búsqueda:** Por nombre, cédula, servicios
- **Validar:**
  - ✅ Carga todos los clientes
  - ✅ Navegación anterior/siguiente funciona
  - ✅ Selector de items por página cambia cantidad
  - ✅ Filtro por segmento reduce lista
  - ✅ Búsqueda filtra en tiempo real
  - ✅ Estadísticas se actualizan correctamente

### 2. 📞 REPORTE DE CONTACTOS
- **Filtros:** Por tipo (Llamada, Email, WhatsApp, Visita) y fecha
- **Tabla:** Cliente, Tipo, Fecha, Resultado, Notas
- **Validar:**
  - ✅ Carga todas las interacciones
  - ✅ Filtro por tipo funciona
  - ✅ Filtro por fecha funciona
  - ✅ Tabla muestra datos correctos
  - ✅ Orden por fecha descendente

### 3. 📈 PIPELINE DE VENTAS
- **Columns:** Prospecto | Contactado | Negociación | Ganado | Perdido
- **Datos:** Nombre cliente, segmento, plan
- **Validar:**
  - ✅ Muestra clientes agrupados por estado
  - ✅ Contador de clientes por estado correcto
  - ✅ Información cliente completa en card

### 4. 🎯 METAS
- **Por segmento:** PLATINO, ORO, PLATA, BRONCE
- **Datos:** Objetivo, Alcanzado, Porcentaje
- **Validar:**
  - ✅ Muestra 4 segmentos siempre
  - ✅ Calcula alcanzado correctamente (basado en clientes)
  - ✅ Progreso visual muestra porcentaje
  - ✅ Guardar nueva meta persiste datos

### 5. 📧 CAMPAÑAS
- **Crear:** Asunto, Mensaje, Segmento
- **Historial:** Mostrar campañas enviadas
- **Validar:**
  - ✅ Formulario se envía sin errores
  - ✅ Mensaje confirmación aparece
  - ✅ Historial muestra campañas creadas
  - ✅ Datos se guardan en Firestore

### 6. ⚡ ACTIVIDADES
- **Timeline:** Cliente creado, editado, contactado
- **Filtro:** Por tipo de actividad
- **Orden:** Más reciente primero
- **Validar:**
  - ✅ Muestra últimas 50 actividades
  - ✅ Ícono correcto por tipo
  - ✅ Timestamp relativo (Hoy, Ayer, fecha)
  - ✅ Filtro por tipo funciona

### 7. ⭐ CLIENTES VIP
- **Botón:** Estrella en cada cliente
- **Estado:** Activo (llena) o inactivo (vacía)
- **Validar:**
  - ✅ Botón estrella visible en clientes
  - ✅ Click cambia estado VIP
  - ✅ Se persiste en Firestore
  - ✅ Vista VIP muestra solo favoritos

### 8. 📊 ESTADÍSTICAS COMPARATIVAS
- **Datos:** Mes actual vs mes anterior
- **Por segmento:** Crecimiento PLATINO, ORO, PLATA
- **Validar:**
  - ✅ Calcula crecimiento % correcto
  - ✅ Compara mes anterior
  - ✅ Muestra 4 cards

### 9. ⚡ ACCIONES RÁPIDAS
- **Botones:** Llamar, WhatsApp, Email, Nota, Agendar
- **Validar:**
  - ✅ Modal se abre al hacer clic
  - ✅ Llamar abre tel:
  - ✅ WhatsApp abre mensaje
  - ✅ Email abre mailto:
  - ✅ Nota guarda en cliente
  - ✅ Agendar descarga .ics

### 10. 📥 EXPORTAR EXCEL
- **Datos:** Todos los clientes en XLSX
- **Columnas:** Cédula, Nombre, Email, Teléfono, Segmento, Plan, Estado, Score, Fecha
- **Validar:**
  - ✅ Botón descarga sin errores
  - ✅ Archivo .xlsx se genera
  - ✅ Contiene todos los clientes
  - ✅ Formato correcto en Excel

### 11. 🚨 ALERTAS INTELIGENTES
- **Notificaciones:** Sin contacto >30 días, cumpleaños próximos
- **Badge:** Número de alertas en campana
- **Validar:**
  - ✅ Se verifica automáticamente
  - ✅ Badge muestra número correcto
  - ✅ Logs muestran alertas

---

## Checklist de Prueba

```
[ ] Mis Clientes - Paginación funciona
[ ] Mis Clientes - Filtro segmento funciona  
[ ] Mis Clientes - Búsqueda funciona
[ ] Mis Clientes - Estadísticas se actualizan
[ ] Contactos - Filtro tipo funciona
[ ] Contactos - Filtro fecha funciona
[ ] Pipeline - Muestra clientes por estado
[ ] Metas - Muestra 4 segmentos
[ ] Metas - Progreso visual correcto
[ ] Metas - Guardar funciona
[ ] Campañas - Formulario se envía
[ ] Campañas - Historial muestra datos
[ ] Actividades - Timeline muestra eventos
[ ] Actividades - Filtro funciona
[ ] VIP - Botón estrella funciona
[ ] VIP - Vista VIP muestra favoritos
[ ] Estadísticas - Cálculos correctos
[ ] Acciones Rápidas - Modal se abre
[ ] Acciones Rápidas - Botones funcionan
[ ] Excel - Descarga sin errores
[ ] Alertas - Badge actualiza
```

---

## Notas de Debugging

Si algo no funciona, revisar:

1. **Console (F12):** Ver logs de error
2. **Network:** Verificar que las requests a Firestore se hacen
3. **Firestore:** Revisar que datos existen en colecciones
4. **Permisos:** Verificar que rol es admin o executive
5. **Auth:** Verificar que usuario está autenticado

---

## Cómo reportar un bug

Proporcionar:
1. Qué intentaste hacer
2. Qué sucedió (error, comportamiento inesperado)
3. Screenshot si es posible
4. Console error si hay
5. Pasos para reproducir
