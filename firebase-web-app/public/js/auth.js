/**
 * Gestión de Autenticación con Firebase
 * Login, Registro, Logout y verificación de sesión
 * Ahora usa Firestore para validar usuarios autorizados
 */

import { auth, db } from './firebase-config.js';
import deviceFingerprint from './device-fingerprint.js';
import csrfTokenManager from './csrf-protection.js';
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    doc, 
    setDoc,
    getDoc,
    collection,
    query,
    where,
    getDocs
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

/**
 * Verificar si un email está autorizado (existe en Firestore)
 */
async function isAuthorizedUser(email) {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            return false;
        }
        
        // Verificar que esté activo
        const userData = querySnapshot.docs[0].data();
        return userData.isActive !== false;
        
    } catch (error) {
        console.error('Error verificando usuario autorizado:', error);
        return false;
    }
}

/**
 * Mostrar mensaje en la página
 */
function showMessage(message, type = 'info') {
    const messageBox = document.getElementById('authMessage');
    if (messageBox) {
        messageBox.textContent = message;
        messageBox.className = `message-box message-${type}`;
        messageBox.classList.remove('hidden');

        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 5000);
    }
}

/**
 * Registro de nuevo usuario - YA NO SE USA
 * Los usuarios ahora se crean desde el panel de administración
 */
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        showMessage('❌ El registro directo está deshabilitado. Los usuarios deben ser creados por un administrador.', 'error');
        return;
        
        /* CÓDIGO ANTERIOR DESHABILITADO
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // VERIFICAR SI EL CORREO ESTÁ AUTORIZADO
        const isAuthorized = await isAuthorizedUser(email);
        if (!isAuthorized) {
            showMessage('❌ Acceso denegado. Este correo no está autorizado. Contacta al administrador.', 'error');
            return;
        }
        
        // Validar contraseñas
        if (password !== confirmPassword) {
            showMessage('Las contraseñas no coinciden', 'error');
            return;
        }
        
        if (password.length < 6) {
            showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }
        
        try {
            showMessage('Creando cuenta...', 'info');
            
            // Crear usuario en Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Actualizar perfil con el nombre
            await updateProfile(user, {
                displayName: name
            });
            
            // Guardar datos adicionales en Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name: name,
                email: email,
                createdAt: new Date().toISOString(),
                role: 'user'
            });
            
            showMessage('¡Cuenta creada exitosamente! Redirigiendo...', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            
        }
        */
    });
}

/**
 * Login de usuario - CON PROTECCIONES DE SEGURIDAD
 */
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            showMessage('Iniciando sesión...', 'info');
            
            // 🔒 PASO 1: Generar Device Fingerprint (primera vez) o validar (login previos)
            const fingerprintValidation = await deviceFingerprint.validate();
            
            if (!fingerprintValidation.valid && deviceFingerprint.getStored() !== null) {
                // El fingerprint no coincide y YA HABÍA UN ALMACENADO - posible hijacking
                console.error('⚠️ SECURITY ALERT:', fingerprintValidation.reason);
                showMessage('❌ ALERTA DE SEGURIDAD: El dispositivo no coincide con el login anterior. Por favor, intenta de nuevo.', 'error');
                await signOut(auth);
                deviceFingerprint.clear();
                return;
            }
            
            // 🔒 PASO 2: Generar CSRF Token (se enviará con la solicitud)
            const csrfToken = csrfTokenManager.getToken();
            
            // Primero hacer login en Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // 🔒 PASO 3: Después verificar en Firestore si está autorizado
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            
            if (!userDoc.exists()) {
                showMessage('❌ Acceso denegado. Usuario no encontrado en el sistema.', 'error');
                await signOut(auth);
                return;
            }
            
            const userData = userDoc.data();
            
            if (userData.isActive === false) {
                showMessage('❌ Acceso denegado. Tu cuenta está inactiva.', 'error');
                await signOut(auth);
                return;
            }
            
            // 🔒 PASO 4: Guardar device fingerprint en localStorage (para futuras validaciones)
            const newFingerprint = await deviceFingerprint.generate();
            deviceFingerprint.save(newFingerprint);
            
            // 🔒 PASO 5: Guardar CSRF token en sessionStorage también (para protección adicional)
            sessionStorage.setItem('csrfToken', csrfToken);
            
            // 🔒 PASO 6: Registrar el login en Firestore para auditoría
            await setDoc(doc(db, 'users', user.uid), {
                ...userData,
                lastLogin: new Date().toISOString(),
                lastLoginDevice: newFingerprint.slice(0, 20) + '...'
            });
            
            console.log('✅ Login exitoso - Dispositivo fingerprinted y protecciones activadas');
            showMessage('¡Bienvenido! Redirigiendo...', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            
            let errorMessage = 'Error al iniciar sesión';
            
            switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    errorMessage = 'Correo o contraseña incorrectos';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Correo electrónico inválido';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Esta cuenta ha sido deshabilitada';
                    break;
            }
            
            showMessage(errorMessage, 'error');
        }
    });
}

/**
 * Verificar autenticación en la página principal
 */
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            // No hay usuario autenticado, redirigir a login
            window.location.href = 'login.html';
        } else {
            // Obtener datos del usuario desde Firestore usando su UID
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            
            if (!userDoc.exists()) {
                alert('❌ Acceso denegado. Usuario no encontrado en el sistema.');
                await signOut(auth);
                window.location.href = 'login.html';
                return;
            }
            
            const userData = userDoc.data();
            
            // Verificar que esté activo
            if (userData.isActive === false) {
                alert('❌ Acceso denegado. Tu cuenta está inactiva.');
                await signOut(auth);
                window.location.href = 'login.html';
                return;
            }
            
            // Usuario autenticado y autorizado, cargar datos
            console.log('✅ Usuario autenticado:', user.email);
            console.log('📊 Datos del usuario:', userData);
            
            // Mostrar nombre del usuario en la interfaz
            const userNameElement = document.getElementById('userName');
            if (userNameElement) {
                const displayName = userData?.name || user.displayName || user.email;
                userNameElement.textContent = displayName;
                console.log('👤 Nombre mostrado:', displayName);
            }
            
            // Si es admin, mostrar botón de panel admin
            console.log('🔑 Rol del usuario:', userData?.role);
            if (userData?.role === 'admin') {
                const btnAdminPanel = document.getElementById('btnAdminPanel');
                if (btnAdminPanel) {
                    btnAdminPanel.style.display = 'inline-block';
                    console.log('👨‍💼 Botón Panel Admin mostrado');
                } else {
                    console.error('❌ Botón btnAdminPanel no encontrado en el DOM');
                }
            } else {
                console.log('ℹ️ Usuario no es admin, botón oculto');
            }
            
            // Configurar botón de logout
            const logoutBtn = document.getElementById('btnLogout');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', async () => {
                    try {
                        // 🔒 Limpiar fingerprint y CSRF tokens al logout
                        deviceFingerprint.clear();
                        csrfTokenManager.clear();
                        sessionStorage.removeItem('csrfToken');
                        
                        await signOut(auth);
                        window.location.href = 'login.html';
                    } catch (error) {
                        console.error('Error al cerrar sesión:', error);
                    }
                });
            }
            
            // Inicializar módulo de gestión de llamadas
            if (typeof initCallsManagement === 'function') {
                initCallsManagement(user.uid);
            }
        }
    });
}

/**
 * Redirigir a index si ya está autenticado (en páginas de login/registro)
 */
if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Ya está autenticado, redirigir a la app
            window.location.href = 'index.html';
        }
    });
}
