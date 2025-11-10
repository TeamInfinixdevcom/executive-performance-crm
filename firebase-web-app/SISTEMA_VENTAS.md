# 📊 Sistema de Tracking de Ventas - Guía Completa

## ¿Qué cambió?

### ANTES (❌ Incorrecto)
Las metas se calculaban basadas en la **cantidad de clientes en cada segmento**:
- Si tienes 8 clientes clasificados como PLATINO = **8/15 = 53%** (incluso si no los vendiste este mes)
- Problema: Incluye clientes heredados de meses anteriores

### AHORA (✅ Correcto)
Las metas se calculan basadas en **ventas reales de este mes**:
- Si vendiste 8 planes PLATINO este mes = **8/15 = 53%** (solo este mes)
- Cada nueva venta es registrada automáticamente en Firestore

---

## 🎯 Cómo Funciona

### 1. Registro Automático de Ventas

**Al crear un cliente nuevo:**
```
1. Completas el formulario en "Mis Clientes"
2. Haces clic en "Guardar Cliente"
3. Sistema automáticamente:
   - Crea el cliente
   - Registra una venta en colección "ventas"
   - Tipo: "nuevo_cliente"
   - Segmento: El que seleccionaste
   - Fecha: Hoy
```

**Ejemplo:**
- Crear cliente "JUAN PÉREZ" como PLATINO → Registra 1 venta PLATINO de hoy
- Dashboard muestra: 1/15 de meta PLATINO completada

### 2. Registro de Cambios de Plan

**Al actualizar un cliente existente (cambiar plan/segmento):**
```
1. Abres cliente existente
2. Cambias:
   - tipoPlan: "ESTÁNDAR" → "PREMIUM"
   - O segmento: "ORO" → "PLATINO"
3. Haces clic en "Guardar"
4. Sistema automáticamente:
   - Actualiza datos del cliente
   - Registra una venta en colección "ventas"
   - Tipo: "upgrade" | "downgrade" | "renovacion"
   - Fecha: Hoy
```

**Tipos de venta:**
- **upgrade**: Plan de menor a mayor valor
- **downgrade**: Plan de mayor a menor valor
- **renovacion**: Plan del mismo valor (solo cambio de segmento)
- **nuevo_cliente**: Cliente nuevo

---

## 📈 Cálculo de Metas

### Fórmula
```
Metas Este Mes = Contar todas las ventas del mes actual
               donde segmento = X
               y tipo_venta = cualquiera

Porcentaje = (Ventas Este Mes / Objetivo) × 100
```

### Ejemplo Real

**Mes: Noviembre 2024**

| Segmento | Ventas Nov | Objetivo | Progreso | % |
|----------|-----------|----------|----------|---|
| PLATINO  | 8         | 15       | ▓▓▓▓░░░░ | 53% |
| ORO      | 12        | 20       | ▓▓▓▓░░░░ | 60% |
| PLATA    | 5         | 10       | ▓▓░░░░░░ | 50% |
| BRONCE   | 18        | 30       | ▓▓▓░░░░░ | 60% |

**Si entra Diciembre:**
- Los contadores se resetean a 0
- Solo cuentan las ventas de Diciembre
- Noviembre queda en el historial

---

## 🔍 Visualizar Historial de Ventas

### En Tab "Metas":

1. **Botón "🔄 Actualizar"**: Recarga las metas en tiempo real
2. **Botón "📊 Ver Reporte"**: Muestra tabla completa de ventas

### Reporte de Ventas
```
Tabla con columnas:
- Cliente: Nombre del cliente
- Segmento: PLATINO | ORO | PLATA | BRONCE
- Plan: Tipo de plan (PRO, PREMIUM, etc)
- Tipo: ✨ Nuevo | ⬆️ Upgrade | ⬇️ Downgrade | 🔄 Renovación
- Fecha: Cuándo se registró la venta
```

---

## 💾 Datos en Firestore

### Colección: ventas

Cada registro tiene:
```json
{
  "clientId": "abc123",
  "clientName": "JUAN PÉREZ GONZALEZ",
  "executiveId": "uid_del_ejecutivo",
  "executiveName": "ejecutivo@ice.go.cr",
  "segmento": "PLATINO",
  "tipoPlan": "PRO",
  "estadoPlan": "Activo",
  "tipoVenta": "nuevo_cliente",
  "monto": 0,
  "fechaVenta": "2024-11-15T14:30:00Z",
  "createdAt": "2024-11-15T14:30:00Z"
}
```

### Colección: metas

Cada meta guardada:
```json
{
  "executiveId": "uid_del_ejecutivo",
  "segment": "PLATINO",
  "objetivo": 15,
  "updatedAt": "2024-11-01T10:00:00Z"
}
```

---

## 🚨 Casos Comunes

### Caso 1: Cliente nuevo en PLATINO
```
Acción: Crear cliente "CARLOS" segmento PLATINO
Resultado:
  - Cliente guardado en colección 'clients'
  - 1 venta registrada en colección 'ventas'
  - tipo: "nuevo_cliente"
  - Metas PLATINO: 1/15
```

### Caso 2: Actualizar cliente de ORO a PLATINO
```
Acción: Editar cliente "CARLOS" de ORO → PLATINO
Resultado:
  - Cliente actualizado en colección 'clients'
  - 1 venta registrada en colección 'ventas'
  - tipo: "upgrade" (si PLATINO > ORO en valor)
  - Metas ORO: -1
  - Metas PLATINO: +1
```

### Caso 3: Cambiar plan del cliente
```
Acción: Editar cliente "CARLOS" tipoPlan ESTÁNDAR → PREMIUM
Resultado:
  - Cliente actualizado
  - 1 venta registrada
  - tipo: "upgrade" (si PREMIUM > ESTÁNDAR)
  - Metas se actualizan según nuevo segmento
```

---

## ⚙️ Configuración de Metas

### Editar objetivo de meta

1. En Tab "Metas", ver cada card de segmento
2. Campo input con número actual
3. Cambiar el número
4. Clic en botón "💾 Guardar"
5. Sistema guarda en Firestore

**Nota:** El objetivo es global para todo el mes. Si cambias a mitad de mes, solo aplica para lo que queda.

---

## 📅 Períodos de Cálculo

### Actual (Este Mes)
- Solo cuenta ventas desde hoy de mes hasta hoy
- Se resetea el primer día del mes

**Futuro (Próximas versiones):**
- [ ] Período: Este Trimestre
- [ ] Período: Este Año
- [ ] Período: Rango Personalizado
- [ ] Comparativa mes anterior
- [ ] Gráfico de tendencia de ventas

---

## 🔐 Reglas de Acceso (Firestore)

### Colección "ventas"
- ✅ Ejecutivo puede ver solo sus propias ventas
- ✅ Admin puede ver todas las ventas
- ✅ Ejecutivo puede crear ventas (automático desde app)
- ✅ Ejecutivo puede actualizar sus propias ventas
- ✅ Ejecutivo NO puede ver ventas de otros

---

## ✅ Checklist de Validación

- [ ] Crear cliente nuevo
  - [ ] Sistema registra 1 venta automáticamente
  - [ ] Metas actualizan el contador
  - [ ] Reportemuestra la nueva venta
  
- [ ] Editar cliente: cambio de segmento
  - [ ] Sistema registra 1 venta tipo upgrade/downgrade
  - [ ] Metas decrementan segmento anterior
  - [ ] Metas incrementan segmento nuevo
  - [ ] Reporte muestra venta con tipo correcto
  
- [ ] Ver Reporte de Ventas
  - [ ] Tabla carga correctamente
  - [ ] Muestra todas las ventas de este mes
  - [ ] Fechas son correctas
  - [ ] Tipos de venta se etiquetan correctamente
  
- [ ] Guardar meta nueva
  - [ ] Objetivo se actualiza en card
  - [ ] Guardar sin error
  - [ ] Actualizar recalcula automáticamente

---

## 📞 Soporte

Si las metas no se actualizan:
1. Haz clic en "🔄 Actualizar" en pestaña Metas
2. Abre consola (F12 → Console)
3. Busca errores rojos

Si necesitas resetear metas:
- Contacta al admin
- Admin puede eliminar registros en Firestore manualmente

---

**Versión:** 1.0  
**Última actualización:** Noviembre 2024  
**Sistema:** Executive Performance ICE CRM
