# 📦 Instrucciones de Instalación - Node.js y Firebase

## ⚠️ Node.js no está instalado en tu sistema

Para ejecutar esta aplicación, necesitas instalar Node.js primero.

## 🔽 Paso 1: Instalar Node.js

### Opción A: Descarga desde el sitio oficial (RECOMENDADO)

1. Ve a: https://nodejs.org/
2. Descarga la versión **LTS (Long Term Support)** para Windows
3. Ejecuta el instalador descargado
4. Sigue el asistente de instalación (acepta los valores por defecto)
5. **Importante:** Marca la casilla "Automatically install the necessary tools"

### Opción B: Usar Chocolatey (si lo tienes instalado)

```powershell
choco install nodejs-lts
```

### Opción C: Usar winget (Windows Package Manager)

```powershell
winget install OpenJS.NodeJS.LTS
```

## ✅ Paso 2: Verificar la instalación

Después de instalar Node.js, **cierra y vuelve a abrir PowerShell/Terminal**, luego ejecuta:

```powershell
node --version
npm --version
```

Deberías ver algo como:
```
v18.x.x
9.x.x
```

## 🔥 Paso 3: Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita **Firestore Database**:
   - Ve a "Firestore Database" en el menú lateral
   - Haz clic en "Crear base de datos"
   - Selecciona el modo (prueba o producción)
   - Elige la ubicación del servidor

4. Obtén las credenciales de servicio:
   - Ve a Configuración del proyecto (⚙️ icono de engranaje)
   - Pestaña "Cuentas de servicio"
   - Haz clic en "Generar nueva clave privada"
   - Se descargará un archivo JSON

5. Configura el archivo `.env`:
   - Abre el archivo `.env` en la raíz del proyecto
   - Copia los valores del JSON descargado:

```env
PORT=3000
NODE_ENV=development

FIREBASE_PROJECT_ID=tu-proyecto-id-aqui
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nCOPIA_AQUI_TU_CLAVE_PRIVADA\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://tu-proyecto.firebaseio.com
```

## 🚀 Paso 4: Instalar dependencias y ejecutar

Una vez Node.js esté instalado y el `.env` configurado:

```powershell
# Navega al directorio del proyecto
cd c:\Users\rumadr\Desktop\ExecutivePerformance\firebase-web-app

# Instala las dependencias
npm install

# Ejecuta en modo desarrollo
npm run dev
```

## 🌐 Paso 5: Abrir en el navegador

Abre tu navegador en: **http://localhost:3000**

## 🐛 Solución de problemas

### Si npm sigue sin funcionar después de instalar Node.js:

1. Cierra TODAS las ventanas de PowerShell/Terminal
2. Vuelve a abrir PowerShell/Terminal
3. Verifica: `echo $env:PATH`
4. Debe incluir algo como: `C:\Program Files\nodejs\`

### Si hay error con el puerto 3000:

Cambia el puerto en `.env`:
```env
PORT=3001
```

### Si hay error de Firebase:

Verifica que:
- El archivo `.env` existe en la raíz del proyecto
- Las credenciales son correctas
- Firestore está habilitado en Firebase Console
- No hay espacios extras en las variables de entorno

## 📞 Necesitas ayuda?

1. Verifica que Node.js esté instalado: `node --version`
2. Verifica que npm esté disponible: `npm --version`
3. Asegúrate de estar en el directorio correcto del proyecto
4. Revisa que el archivo `.env` tenga las credenciales correctas

---

Una vez completados estos pasos, podrás ejecutar la aplicación sin problemas. 🎉
