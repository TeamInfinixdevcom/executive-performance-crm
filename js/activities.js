// Activities Management Module

// Load activities list
async function loadActivities() {
    try {
        const activitiesList = document.getElementById('activities-list');
        if (!activitiesList) return;
        
        activitiesList.innerHTML = '<p style="text-align: center;">Cargando...</p>';
        
        const snapshot = await database.ref('activities').once('value');
        const activities = snapshot.val() || {};
        
        activitiesList.innerHTML = '';
        
        if (Object.keys(activities).length === 0) {
            activitiesList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No hay actividades registradas</p>';
            return;
        }
        
        Object.entries(activities).forEach(([id, activity]) => {
            const activityCard = document.createElement('div');
            activityCard.className = 'activity-card';
            
            const date = new Date(activity.timestamp).toLocaleString('es');
            const statusBadge = `<span class="status-badge ${activity.status || 'active'}">${activity.status || 'activo'}</span>`;
            
            activityCard.innerHTML = `
                <div class="activity-card-content">
                    <h3>${activity.title || 'Actividad'}</h3>
                    <p>${activity.description || ''}</p>
                    <p style="font-size: 12px; color: var(--text-secondary); margin-top: 5px;">${date}</p>
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    ${statusBadge}
                    <button class="action-btn edit" onclick="editActivity('${id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteActivity('${id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            activitiesList.appendChild(activityCard);
        });
    } catch (error) {
        console.error('Error loading activities:', error);
        showNotification('Error al cargar actividades', 'error');
    }
}

// Add activity button handler
document.getElementById('add-activity-btn')?.addEventListener('click', () => {
    showActivityModal();
});

// Show activity modal
function showActivityModal(activityId = null) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <h2>${activityId ? 'Editar Actividad' : 'Nueva Actividad'}</h2>
        <form id="activity-form">
            <div class="form-group">
                <label>Título *</label>
                <input type="text" id="activity-title" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Descripción</label>
                <textarea id="activity-description" class="form-control" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label>Tipo</label>
                <select id="activity-type" class="form-control">
                    <option value="task">Tarea</option>
                    <option value="meeting">Reunión</option>
                    <option value="call">Llamada</option>
                    <option value="email">Email</option>
                    <option value="sale">Venta</option>
                    <option value="client">Cliente</option>
                </select>
            </div>
            <div class="form-group">
                <label>Estado</label>
                <select id="activity-status" class="form-control">
                    <option value="pending">Pendiente</option>
                    <option value="active">Activo</option>
                    <option value="completed">Completado</option>
                </select>
            </div>
            <button type="submit" class="btn-primary">
                <i class="fas fa-save"></i> Guardar
            </button>
        </form>
    `;
    
    modal.style.display = 'block';
    
    // Load activity data if editing
    if (activityId) {
        loadActivityData(activityId);
    }
    
    // Handle form submission
    document.getElementById('activity-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveActivity(activityId);
    });
}

// Load activity data for editing
async function loadActivityData(activityId) {
    try {
        const snapshot = await database.ref('activities/' + activityId).once('value');
        const activity = snapshot.val();
        
        if (activity) {
            document.getElementById('activity-title').value = activity.title || '';
            document.getElementById('activity-description').value = activity.description || '';
            document.getElementById('activity-type').value = activity.type || 'task';
            document.getElementById('activity-status').value = activity.status || 'pending';
        }
    } catch (error) {
        console.error('Error loading activity:', error);
    }
}

// Save activity
async function saveActivity(activityId) {
    const activityData = {
        title: document.getElementById('activity-title').value,
        description: document.getElementById('activity-description').value,
        type: document.getElementById('activity-type').value,
        status: document.getElementById('activity-status').value,
        timestamp: new Date().toISOString()
    };
    
    try {
        if (activityId) {
            // Update existing activity
            await database.ref('activities/' + activityId).update(activityData);
            showNotification('Actividad actualizada exitosamente', 'success');
        } else {
            // Add new activity
            await database.ref('activities').push(activityData);
            showNotification('Actividad agregada exitosamente', 'success');
        }
        
        closeModal();
        loadActivities();
    } catch (error) {
        console.error('Error saving activity:', error);
        showNotification('Error al guardar actividad', 'error');
    }
}

// Edit activity
function editActivity(activityId) {
    showActivityModal(activityId);
}

// Delete activity
async function deleteActivity(activityId) {
    if (!confirm('¿Está seguro de eliminar esta actividad?')) return;
    
    try {
        await database.ref('activities/' + activityId).remove();
        showNotification('Actividad eliminada exitosamente', 'success');
        loadActivities();
    } catch (error) {
        console.error('Error deleting activity:', error);
        showNotification('Error al eliminar actividad', 'error');
    }
}

// Initialize activities tab
document.addEventListener('DOMContentLoaded', () => {
    const activitiesNav = document.querySelector('[data-tab="activities"]');
    if (activitiesNav) {
        activitiesNav.addEventListener('click', () => {
            loadActivities();
        });
    }
});
