// Settings Module

// Load settings
async function loadSettings() {
    try {
        if (!currentUser) return;
        
        const snapshot = await database.ref('settings/' + currentUser.uid).once('value');
        const settings = snapshot.val() || {};
        
        // Populate form
        document.getElementById('company-name').value = settings.companyName || '';
        document.getElementById('currency').value = settings.currency || 'USD';
        document.getElementById('email-notifications').checked = settings.emailNotifications !== false;
        document.getElementById('push-notifications').checked = settings.pushNotifications !== false;
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Save settings button handler
document.getElementById('save-settings-btn')?.addEventListener('click', async () => {
    await saveSettings();
});

// Save settings
async function saveSettings() {
    if (!currentUser) return;
    
    const settingsData = {
        companyName: document.getElementById('company-name').value,
        currency: document.getElementById('currency').value,
        emailNotifications: document.getElementById('email-notifications').checked,
        pushNotifications: document.getElementById('push-notifications').checked,
        updatedAt: new Date().toISOString()
    };
    
    try {
        await database.ref('settings/' + currentUser.uid).set(settingsData);
        showNotification('Configuración guardada exitosamente', 'success');
    } catch (error) {
        console.error('Error saving settings:', error);
        showNotification('Error al guardar configuración', 'error');
    }
}

// Initialize settings tab
document.addEventListener('DOMContentLoaded', () => {
    const settingsNav = document.querySelector('[data-tab="settings"]');
    if (settingsNav) {
        settingsNav.addEventListener('click', () => {
            loadSettings();
        });
    }
});
