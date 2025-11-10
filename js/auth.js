// Authentication Module
let currentUser = null;

// Check auth state
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        loadUserProfile(user);
        showApp();
    } else {
        currentUser = null;
        showLogin();
    }
});

// Login form handler
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        showNotification('Inicio de sesión exitoso', 'success');
    } catch (error) {
        showNotification('Error al iniciar sesión: ' + error.message, 'error');
    }
});

// Register link handler
document.getElementById('register-link').addEventListener('click', async (e) => {
    e.preventDefault();
    const email = prompt('Ingrese email:');
    const password = prompt('Ingrese contraseña:');
    
    if (email && password) {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            // Create user profile in database
            await database.ref('users/' + userCredential.user.uid).set({
                email: email,
                name: email.split('@')[0],
                role: 'user',
                createdAt: new Date().toISOString()
            });
            showNotification('Usuario registrado exitosamente', 'success');
        } catch (error) {
            showNotification('Error al registrar: ' + error.message, 'error');
        }
    }
});

// Logout handler
document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
        await auth.signOut();
        showNotification('Sesión cerrada exitosamente', 'success');
    } catch (error) {
        showNotification('Error al cerrar sesión: ' + error.message, 'error');
    }
});

// Load user profile from database
async function loadUserProfile(user) {
    try {
        const snapshot = await database.ref('users/' + user.uid).once('value');
        const userData = snapshot.val() || {};
        
        document.getElementById('user-name').textContent = userData.name || user.email;
        document.getElementById('user-role').textContent = userData.role || 'Usuario';
        
        // Check role-based access
        checkRoleAccess(userData.role);
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

// Role-based access control
function checkRoleAccess(role) {
    const adminOnlyTabs = ['team', 'settings'];
    
    if (role !== 'admin' && role !== 'manager') {
        adminOnlyTabs.forEach(tabName => {
            const navItem = document.querySelector(`[data-tab="${tabName}"]`);
            if (navItem) {
                navItem.style.display = 'none';
            }
        });
    }
}

// Show/hide UI elements
function showLogin() {
    document.getElementById('login-container').style.display = 'flex';
    document.getElementById('app-container').style.display = 'none';
}

function showApp() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'flex';
}

// Notification helper
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);
