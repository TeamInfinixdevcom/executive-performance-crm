# 🔧 Crear Índice Composite en Firebase

## Problema Identificado

El sistema de ventas necesita un índice compuesto para la colección `ventas`:
- Campo: `segmento` (ASCENDING)
- Campo: `fechaVenta` (ASCENDING)

Sin este índice, las queries que filtran por segmento y fecha fallan.

---

## Solución Automática (CLI)

Si tienes Firebase CLI instalado:

```bash
cd c:\Users\rumadr\Desktop\ExecutivePerformance\firebase-web-app
firebase deploy --only firestore:indexes
```

---

## Solución Manual (Firebase Console)

### Paso 1: Ir a Firebase Console

1. Abre: https://console.firebase.google.com/
2. Selecciona proyecto: **executiveperformancek**
3. En lado izquierdo → **Firestore Database**
4. Click en tab **Índices**

### Paso 2: Crear Índice Compuesto

1. Click botón azul **"Crear índice"** (si no aparece automáticamente)
2. Rellena:
   - **Colección**: `ventas`
   - **Primer campo**: `segmento` - Ascendente
   - **Segundo campo**: `fechaVenta` - Ascendente
   - **Estado de la consulta**: (dejarlo vacío)
3. Click **Crear**

### Paso 3: Esperar Compilación

- El índice tardará 5-15 minutos en compilarse
- Estado cambiará a "Habilitado" cuando esté listo
- Mientras tanto, los queries simples (sin filtro de fecha) funcionarán

---

## Verificar Índice

Después de que el índice esté listo:

```bash
cd c:\Users\rumadr\Desktop\ExecutivePerformance\firebase-web-app
"C:\Program Files\nodejs\node.exe" test-sales-system.js
```

Deberías ver:
```
✅ Pasadas: 6/6
✅ ¡Todas las pruebas pasaron!
```

---

## Link Directo

Si el índice falta, Firebase te da un link directo en el error:

Busca en el error algo como:
```
You can create it here: https://console.firebase.google.com/v1/r/project/executiveperformancek/firestore/indexes?create_composite=...
```

Copia y pega en el navegador - ¡crea el índice automáticamente!

---

## Alternativa: Desplegar con Cloud Firestore Emulator

Para desarrollo local sin índices:

```bash
firebase emulators:start --only firestore
```

Pero para producción, NECESITAS los índices.

---

**Nota**: Actualmente sin el índice, el sistema de metas funcionará para:
- ✅ Crear ventas (funciona)
- ✅ Ver todas las ventas (funciona)
- ✅ Ver ventas sin filtros complejos (funciona)
- ❌ Filtrar por segmento + fecha (necesita índice)

Crea el índice y todo funcionará perfectamente.
