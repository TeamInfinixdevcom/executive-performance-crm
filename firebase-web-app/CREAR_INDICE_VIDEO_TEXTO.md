# 📹 GUÍA VIDEO-TEXTO: CREAR ÍNDICE EN 2 MINUTOS

## 🎬 SIMULACIÓN EXACTA DE LOS CLICKS

### INICIO: En tu navegador abierto

```
Dirección: https://console.firebase.google.com/
```

---

## ESCENA 1: Seleccionar Proyecto (20 segundos)

```
VERAS:
┌──────────────────────────────────────────────┐
│ Firebase Console                             │
├──────────────────────────────────────────────┤
│                                              │
│  Tus proyectos:                              │
│  ├─ executiveperformancek     ← HACES CLIC  │
│  ├─ otro-proyecto                           │
│  └─ otro-mas                                 │
│                                              │
└──────────────────────────────────────────────┘

ACCIÓN: Haz clic en "executiveperformancek"
RESULTADO: Entra al proyecto
```

---

## ESCENA 2: Ir a Firestore (20 segundos)

```
VERAS (menú izquierdo):
┌──────────────────────────────────────────────┐
│ Menú                                         │
├──────────────────────────────────────────────┤
│                                              │
│ 🏠 Dashboard                                 │
│ 🗄️  Firestore Database    ← HACES CLIC      │
│ 🔐 Authentication                            │
│ 📊 Analytics                                 │
│                                              │
└──────────────────────────────────────────────┘

ACCIÓN: Haz clic en "Firestore Database"
RESULTADO: Abre Firestore (toma 5 segundos)
```

---

## ESCENA 3: Tab Índices (15 segundos)

```
VERAS (en Firestore):
┌──────────────────────────────────────────────┐
│ Firestore Database                           │
├──────────────────────────────────────────────┤
│                                              │
│ [Datos]  [Índices] ← HACES CLIC  [Reglas]  │
│                                              │
│ (Tab Datos tiene tabla de datos)             │
│ (Tab Índices - vacío o con índices)         │
│ (Tab Reglas tiene las reglas de seguridad)   │
│                                              │
└──────────────────────────────────────────────┘

ACCIÓN: Haz clic en tab "Índices"
RESULTADO: Ves la pantalla de índices
```

---

## ESCENA 4: Botón Crear (15 segundos)

```
VERAS (en tab Índices):
┌──────────────────────────────────────────────┐
│ Índices                                      │
├──────────────────────────────────────────────┤
│                                              │
│ [🔵 Crear índice compuesto]  ← HACES CLIC  │
│                                              │
│ (Abajo puede haber otros índices)            │
│                                              │
└──────────────────────────────────────────────┘

ACCIÓN: Haz clic en botón azul "Crear índice compuesto"
RESULTADO: Abre formulario
```

---

## ESCENA 5: Formulario - Llenar Colección (15 segundos)

```
VERAS:
┌──────────────────────────────────────────────────┐
│ Crear índice compuesto                           │
├──────────────────────────────────────────────────┤
│                                                  │
│ Colección:  [                               ▼]  │
│ (está vacío - aparece dropdown)                  │
│                                                  │
│ Campo 1:    [                               ▼]  │
│ (deshabilitado hasta elegir colección)           │
│                                                  │
└──────────────────────────────────────────────────┘

ACCIÓN: 
  1. Haz clic en dropdown de Colección
  2. Escribes: ventas
  3. O seleccionas de lista si aparece

RESULTADO: Selecciona "ventas"
```

---

## ESCENA 6: Formulario - Campo 1 (15 segundos)

```
VERAS (después de seleccionar "ventas"):
┌──────────────────────────────────────────────────┐
│ Crear índice compuesto                           │
├──────────────────────────────────────────────────┤
│                                                  │
│ Colección:  [ventas                         ▼]  │
│                                                  │
│ Campo 1:    [                               ▼]  │
│ Orden:      [⬆️ ASCENDENTE            ] ✅     │
│ (automático)                                     │
│                                                  │
│ Campo 2:    [                               ▼]  │
│                                                  │
└──────────────────────────────────────────────────┘

ACCIÓN:
  1. Haz clic en dropdown de "Campo 1"
  2. Busca/escribe: segmento
  3. Selecciona "segmento"

RESULTADO: Selecciona segmento (orden ASCENDENTE automático)
```

---

## ESCENA 7: Formulario - Campo 2 (15 segundos)

```
VERAS:
┌──────────────────────────────────────────────────┐
│ Crear índice compuesto                           │
├──────────────────────────────────────────────────┤
│                                                  │
│ Colección:  [ventas                         ▼]  │
│                                                  │
│ Campo 1:    [segmento               ] ⬆️       │
│                                                  │
│ Campo 2:    [                               ▼]  │
│ Orden:      [⬆️ ASCENDENTE            ] ✅     │
│                                                  │
└──────────────────────────────────────────────────┘

ACCIÓN:
  1. Haz clic en dropdown de "Campo 2"
  2. Busca/escribe: fechaVenta
  3. Selecciona "fechaVenta"

RESULTADO: Selecciona fechaVenta (orden ASCENDENTE automático)
```

---

## ESCENA 8: Verificar Antes de Crear (10 segundos)

```
VERAS (formulario completo):
┌──────────────────────────────────────────────────┐
│ Crear índice compuesto                           │
├──────────────────────────────────────────────────┤
│                                                  │
│ Colección:  [ventas                         ▼]  │
│                                                  │
│ Campo 1:    [segmento               ] ⬆️       │
│                                                  │
│ Campo 2:    [fechaVenta             ] ⬆️       │
│                                                  │
│ Estado de la consulta: [                    ]   │
│ (DEJARLO VACÍO - no tocar)                      │
│                                                  │
│                    [Crear]  [Cancelar]          │
│                                                  │
└──────────────────────────────────────────────────┘

VERIFICAR:
  ✅ Colección: ventas
  ✅ Campo 1: segmento (⬆️)
  ✅ Campo 2: fechaVenta (⬆️)
  ✅ Los dos campos en ASCENDENTE
  ✅ Estado de consulta: VACÍO
```

---

## ESCENA 9: CREAR (5 segundos)

```
ACCIÓN: Haz clic en botón azul "Crear"

RESULTADO INMEDIATO:
  ├─ Cierra el formulario
  ├─ Muestra la lista de índices
  └─ Nuevo índice aparece en NARANJA (compilando...)
```

---

## ESCENA 10: Esperar a que Compile (5-15 minutos)

```
VERAS (en lista de índices):
┌──────────────────────────────────────────────┐
│ Índices                                      │
├──────────────────────────────────────────────┤
│                                              │
│ ventas                                       │
│ segmento (ASC)                               │
│ fechaVenta (ASC)                             │
│                                              │
│ Estado: ⏳ EN COMPILACIÓN                    │
│                                              │
│ (Puede decir "En compilación..." o "Activo")│
│                                              │
└──────────────────────────────────────────────┘

ESPERA: Puede durar 5-15 minutos

CUANDO ESTÉ LISTO:
  Estado: ✅ HABILITADO (en verde)
```

---

## ESCENA 11: Verificación Final (Automática)

```
Una vez esté verde, tu sistema funcionará:

1. Abre http://localhost:3000
2. Login
3. Ve a tab "Metas"
4. Clic "📊 Ver Reporte"
5. ✅ Debe cargar la tabla sin errores

¡LISTO! ✅
```

---

## ⚡ RESUMEN RÁPIDO

```
5 Clicks = 2 minutos:

1️⃣  Click en "executiveperformancek"
2️⃣  Click en "Firestore Database"
3️⃣  Click en tab "Índices"
4️⃣  Click en "Crear índice compuesto"
5️⃣  Llena: ventas + segmento + fechaVenta
6️⃣  Click en "Crear"
7️⃣  Espera a verde ✅ (5-15 min pasivo)
```

---

## 🎯 CAMPOS EXACTOS A LLENAR

```
Colección:    ventas
              (escribir en minúsculas exactamente así)

Campo 1:      segmento
              (escribir en minúsculas exactamente así)

Campo 2:      fechaVenta
              (f minúscula, V mayúscula, exactamente así)

Orden 1:      ⬆️ ASCENDENTE (automático)
Orden 2:      ⬆️ ASCENDENTE (automático)

Estado Query: (DEJAR VACÍO - no tocar)
```

---

## ✅ CUANDO ESTÉ LISTO

```
Mensaje en verde:
"✅ Habilitado"

Tu sistema estará 100% operacional:
├─ Metas → Cargan correctamente
├─ Ver Reporte → Funciona sin errores
├─ Cálculos → Son exactos
└─ Todo → ¡Funciona perfecto!
```

---

## 📱 SI ALGO NO SALE

**"No veo el botón Crear índice"**
→ Haz refresh (F5) en la página

**"No aparece el dropdown de colecciones"**
→ Espera 2 segundos después de abrir

**"Dice error al crear"**
→ Verifica que escribiste los nombres exactamente
→ Sin espacios, sin caracteres especiales

**"Sigue naranja después de 30 min"**
→ Cierra y abre again
→ Si persiste, contact support

---

**Tiempo estimado:** 2 minutos (clicks) + 10 minutos (espera pasiva)  
**Dificultad:** ⭐ Muy fácil  
**Resultado:** 100% sistema funcional ✅
