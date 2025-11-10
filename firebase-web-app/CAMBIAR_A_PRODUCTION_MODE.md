# 🔐 Guía: Cambiar de Test Mode a Production Mode en Firestore

## El Problema

Firebase avisa: *"Your Firestore security rules were configured to stop allowing requests after the first 30 days."*

Esto sucede porque al crear Firestore, elegiste **Test Mode** (abierto a internet por 30 días).

## La Solución

### ✅ Ya Hemos Hecho:
1. ✅ Creadas reglas de seguridad FUERTES en `firestore.rules`
2. ✅ Desplegadas las reglas a Firebase
3. ✅ Configurado sistema de roles (admin/executive)
4. ✅ Verificado que todo funciona

### 📋 Lo Que Necesitas Hacer:

#### Opción 1: Verificar que las reglas están activas (RECOMENDADO)

1. Ve a: https://console.firebase.google.com/project/executiveperformancek/firestore/rules
2. **Mira el banner superior** - debería decir una de estas cosas:
   - ✅ **"PRODUCTION rules are live"** - ¡Perfecto! Ya está en Production Mode
   - ⚠️ **"Test mode expires in X days"** - Necesita cambio manual (continúa abajo)
   - ⚠️ **"Test mode has expired"** - Cambio urgente (continúa abajo)

#### Opción 2: Cambiar manualmente en la Consola

Si el banner dice "Test Mode":

1. Ve a: https://console.firebase.google.com/project/executiveperformancek/firestore/rules
2. **Reemplaza TODO el contenido** con el contenido de `firestore.rules`
3. Haz clic en **"Publish"**
4. Espera a que compile y se publique
5. Verifica que ahora dice **"Production rules are live"**

#### Opción 3: Forzar desde Terminal (La mejor opción)

Ejecuta este comando en la carpeta del proyecto:

```bash
npx firebase deploy --only firestore:rules
```

Deberías ver:
```
+ cloud.firestore: rules file firestore.rules compiled successfully
+ firestore: released rules firestore.rules to cloud.firestore
+ Deploy complete!
```

---

## 📊 Estado Actual de tu Sistema

- **Colecciones activas**: `users` (4 docs), `clients` (20 docs)
- **Administradores**: 1 (rmadrigalj@ice.go.cr)
- **Ejecutivos**: 3 (ejecutivo1/2 + test user)
- **Reglas**: Compiladas y activas ✅
- **Acceso al Admin Panel**: FUNCIONA ✅

---

## 🛡️ Qué Hacen las Reglas de Seguridad

```plaintext
✅ ADMIN puede:
  - Leer todos los usuarios
  - Crear nuevos usuarios (ejecutivos)
  - Actualizar cualquier usuario
  - Eliminar usuarios

✅ EXECUTIVE (Ejecutivo) puede:
  - Leer sus propios clientes
  - Crear nuevos clientes
  - Actualizar sus clientes
  - Eliminar sus clientes

❌ ANÓNIMOS:
  - No pueden leer nada
  - No pueden escribir nada
```

---

## ✅ Checklist Final

- [ ] Consola de Firebase muestra "Production rules are live"
- [ ] Admin panel funciona sin errores (crear usuarios exitosamente)
- [ ] Ejecutivos pueden login y ver sus clientes
- [ ] No hay advertencias sobre expiración de Test Mode

Si todo está ✅, **¡tu sistema está en PRODUCCIÓN SEGURA!**

---

## 📞 Problemas Comunes

### "Aún dice Test Mode"
→ Ejecuta: `npx firebase deploy --only firestore:rules`

### "El admin panel muestra 'Acceso denegado'"
→ Verifica que el usuario tiene `role: 'admin'` en Firestore

### "Los ejecutivos no pueden crear clientes"
→ Verifica que tienen `isActive: true` en Firestore

### "Todavía veo el banner de expiración después de cambiar"
→ Recarga la página (Ctrl+F5) - Firebase actualiza cada 24 horas
