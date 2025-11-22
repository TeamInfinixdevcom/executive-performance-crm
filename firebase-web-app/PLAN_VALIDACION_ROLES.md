# ✅ PLAN DE VALIDACIÓN MANUAL - AMBOS ROLES

## 🎯 USUARIOS IDENTIFICADOS:

### 👤 **EJECUTIVO**: cnajera@ice.go.cr / 123456
- **Datos esperados**: 108 clientes (PLATINO: 34, ORO: 19, PLATA: 22, BLACK: 33)
- **Debe ver**: Solo sus datos, sus gráficos, sus clientes
- **No debe ver**: Panel admin, datos de otros usuarios

### 👤 **ADMIN**: rmadrigalj@ice.go.cr / [tu_password]
- **Cuenta 1**: "Obando Arguedas Carlos" - 30 clientes
- **Cuenta 2**: "Administrador ICE" - 24 clientes  
- **Debe ver**: Todos los datos, panel admin, gestión usuarios

---

## 🧪 PROTOCOLO DE PRUEBAS:

### **PASO 1: VALIDAR ROL EJECUTIVO**

**Abrir ventana incógnita** → https://executiveperformancek.web.app

1. **Login**: `cnajera@ice.go.cr` / `123456`
2. **Verificar Dashboard**:
   - ✅ Métricas muestran: **Total: 108**
   - ✅ Gráfico superior funciona (sin errores)
   - ✅ Distribución correcta: PLATINO: 34, ORO: 19, etc.
3. **Verificar Consola** (F12):
   - ✅ Aparece: `VERSIÓN CORREGIDA v20251116003`
   - ❌ NO debe aparecer: `destroy is not a function`
4. **Verificar Clientes**:
   - ✅ Ve solo sus 108 clientes
   - ✅ Puede editar/agregar clientes
5. **Verificar Restricciones**:
   - ❌ NO debe ver panel admin
   - ❌ NO debe ver datos de otros usuarios

---

### **PASO 2: VALIDAR ROL ADMIN**

**Nueva ventana incógnita** → https://executiveperformancek.web.app

1. **Login**: `rmadrigalj@ice.go.cr` / [password]
2. **Verificar Dashboard Admin**:
   - ✅ Ve métricas agregadas o sus propios datos
   - ✅ Gráficos funcionan sin errores
3. **Verificar Panel Admin**:
   - ✅ Debe aparecer botón/sección de administración
   - ✅ Puede gestionar usuarios
   - ✅ Ve datos de todos los ejecutivos
4. **Verificar Consola**:
   - ✅ Sin errores JavaScript
   - ✅ Scripts cargan correctamente

---

## 🚨 PUNTOS CRÍTICOS A VERIFICAR:

### **Consola del Navegador (F12)**:
```
✅ DEBE APARECER:
- "✅ Usuario autenticado: [email]"  
- "VERSIÓN CORREGIDA v20251116003"
- "📊 Métricas calculadas: {total: X}"
- "✅ Gráfico simple actualizado"

❌ NO DEBE APARECER:
- "destroy is not a function"
- "Firebase no está inicializado"  
- "db.collection is not a function"
- Errores de permisos
```

### **Elementos Visuales**:
- ✅ **Gráficos cargan** (no quedan en blanco)
- ✅ **Números aparecen** en tarjetas de métricas  
- ✅ **Colores correctos** en gráficos de dona
- ✅ **Responsive** en diferentes tamaños

### **Seguridad de Datos**:
- ✅ **Ejecutivo** solo ve sus datos
- ✅ **Admin** ve todos los datos
- ✅ **Sin leaks** entre usuarios

---

## 📋 CHECKLIST DE VALIDACIÓN:

### ROL EJECUTIVO (cnajera):
- [ ] Login exitoso
- [ ] Dashboard carga sin errores JavaScript
- [ ] Métricas muestran 108 clientes
- [ ] Gráfico superior funciona 
- [ ] Ve solo sus clientes
- [ ] No ve panel admin
- [ ] Consola limpia (sin errores)

### ROL ADMIN (rmadrigalj):  
- [ ] Login exitoso
- [ ] Dashboard admin funciona
- [ ] Ve métricas correspondientes
- [ ] Acceso a panel administrativo
- [ ] Gráficos cargan correctamente
- [ ] Consola limpia (sin errores)

### GENERAL:
- [ ] Sin conflictos entre usuarios
- [ ] Cache busting funcionando
- [ ] Responsive design OK
- [ ] Rendimiento aceptable

---

## 🎯 RESULTADO ESPERADO:

**AMBOS ROLES deben funcionar sin el error de gráficos y mostrar las métricas correctamente según sus permisos.**

Si encuentras algún problema, anótalo con el rol específico y el error exacto.