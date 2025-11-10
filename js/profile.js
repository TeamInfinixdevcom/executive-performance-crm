// Profile Module

// Load profile
async function loadProfile() {
    try {
        if (!currentUser) return;
        
        const snapshot = await database.ref('users/' + currentUser.uid).once('value');
        const userData = snapshot.val() || {};
        
        // Populate form
        document.getElementById('profile-name').value = userData.name || '';
        document.getElementById('profile-email').value = userData.email || currentUser.email;
        document.getElementById('profile-phone').value = userData.phone || '';
        document.getElementById('profile-role').value = userData.role || 'user';
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Update profile button handler
document.getElementById('update-profile-btn')?.addEventListener('click', async () => {
    await updateProfile();
});

// Change avatar button handler
document.getElementById('change-avatar-btn')?.addEventListener('click', () => {
    showNotification('Función de cambio de avatar en desarrollo', 'info');
});

// Update profile
async function updateProfile() {
    if (!currentUser) return;
    
    const profileData = {
        name: document.getElementById('profile-name').value,
        phone: document.getElementById('profile-phone').value,
        updatedAt: new Date().toISOString()
    };
    
    try {
        await database.ref('users/' + currentUser.uid).update(profileData);
        
        // Update display name in sidebar
        document.getElementById('user-name').textContent = profileData.name;
        
        showNotification('Perfil actualizado exitosamente', 'success');
    } catch (error) {
        console.error('Error updating profile:', error);
        showNotification('Error al actualizar perfil', 'error');
    }
}

// Initialize profile tab
document.addEventListener('DOMContentLoaded', () => {
    const profileNav = document.querySelector('[data-tab="profile"]');
    if (profileNav) {
        profileNav.addEventListener('click', () => {
            loadProfile();
        });
    }
});
