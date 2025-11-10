// Team Management Module

// Load team members
async function loadTeam() {
    try {
        const teamGrid = document.getElementById('team-grid');
        if (!teamGrid) return;
        
        teamGrid.innerHTML = '<p style="text-align: center;">Cargando...</p>';
        
        const snapshot = await database.ref('users').once('value');
        const users = snapshot.val() || {};
        
        teamGrid.innerHTML = '';
        
        if (Object.keys(users).length === 0) {
            teamGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No hay miembros del equipo</p>';
            return;
        }
        
        Object.entries(users).forEach(([id, user]) => {
            const teamCard = document.createElement('div');
            teamCard.className = 'team-member-card';
            
            const initials = (user.name || user.email || 'U').substring(0, 2).toUpperCase();
            const roleBadge = getRoleBadge(user.role);
            
            teamCard.innerHTML = `
                <div class="team-member-avatar">
                    ${initials}
                </div>
                <h3>${user.name || user.email}</h3>
                <p>${user.email || ''}</p>
                ${roleBadge}
                <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: center;">
                    <button class="action-btn edit" onclick="editTeamMember('${id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteTeamMember('${id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            teamGrid.appendChild(teamCard);
        });
    } catch (error) {
        console.error('Error loading team:', error);
        showNotification('Error al cargar equipo', 'error');
    }
}

// Get role badge
function getRoleBadge(role) {
    const roleColors = {
        'admin': 'status-badge active',
        'manager': 'status-badge pending',
        'user': 'status-badge inactive'
    };
    
    const roleNames = {
        'admin': 'Administrador',
        'manager': 'Gerente',
        'user': 'Usuario'
    };
    
    const badgeClass = roleColors[role] || 'status-badge';
    const roleName = roleNames[role] || role || 'Usuario';
    
    return `<span class="${badgeClass}">${roleName}</span>`;
}

// Add team member button handler
document.getElementById('add-team-member-btn')?.addEventListener('click', () => {
    showTeamMemberModal();
});

// Show team member modal
function showTeamMemberModal(userId = null) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <h2>${userId ? 'Editar Miembro' : 'Nuevo Miembro'}</h2>
        <form id="team-member-form">
            <div class="form-group">
                <label>Nombre Completo *</label>
                <input type="text" id="member-name" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Email *</label>
                <input type="email" id="member-email" class="form-control" ${userId ? 'disabled' : ''} required>
            </div>
            <div class="form-group">
                <label>Rol</label>
                <select id="member-role" class="form-control">
                    <option value="user">Usuario</option>
                    <option value="manager">Gerente</option>
                    <option value="admin">Administrador</option>
                </select>
            </div>
            ${!userId ? `
            <div class="form-group">
                <label>Contraseña *</label>
                <input type="password" id="member-password" class="form-control" required>
            </div>
            ` : ''}
            <button type="submit" class="btn-primary">
                <i class="fas fa-save"></i> Guardar
            </button>
        </form>
    `;
    
    modal.style.display = 'block';
    
    // Load member data if editing
    if (userId) {
        loadTeamMemberData(userId);
    }
    
    // Handle form submission
    document.getElementById('team-member-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveTeamMember(userId);
    });
}

// Load team member data for editing
async function loadTeamMemberData(userId) {
    try {
        const snapshot = await database.ref('users/' + userId).once('value');
        const user = snapshot.val();
        
        if (user) {
            document.getElementById('member-name').value = user.name || '';
            document.getElementById('member-email').value = user.email || '';
            document.getElementById('member-role').value = user.role || 'user';
        }
    } catch (error) {
        console.error('Error loading team member:', error);
    }
}

// Save team member
async function saveTeamMember(userId) {
    const name = document.getElementById('member-name').value;
    const email = document.getElementById('member-email').value;
    const role = document.getElementById('member-role').value;
    
    try {
        if (userId) {
            // Update existing member
            await database.ref('users/' + userId).update({
                name: name,
                role: role,
                updatedAt: new Date().toISOString()
            });
            showNotification('Miembro actualizado exitosamente', 'success');
        } else {
            // Add new member - create auth account
            const password = document.getElementById('member-password').value;
            
            // Note: Creating users requires admin SDK on backend
            // For now, just save to database
            const newUserRef = database.ref('users').push();
            await newUserRef.set({
                name: name,
                email: email,
                role: role,
                createdAt: new Date().toISOString()
            });
            
            showNotification('Miembro agregado exitosamente. Configure la autenticación en Firebase Console.', 'success');
        }
        
        closeModal();
        loadTeam();
    } catch (error) {
        console.error('Error saving team member:', error);
        showNotification('Error al guardar miembro', 'error');
    }
}

// Edit team member
function editTeamMember(userId) {
    showTeamMemberModal(userId);
}

// Delete team member
async function deleteTeamMember(userId) {
    if (currentUser && currentUser.uid === userId) {
        showNotification('No puedes eliminar tu propio usuario', 'error');
        return;
    }
    
    if (!confirm('¿Está seguro de eliminar este miembro?')) return;
    
    try {
        await database.ref('users/' + userId).remove();
        showNotification('Miembro eliminado exitosamente', 'success');
        loadTeam();
    } catch (error) {
        console.error('Error deleting team member:', error);
        showNotification('Error al eliminar miembro', 'error');
    }
}

// Initialize team tab
document.addEventListener('DOMContentLoaded', () => {
    const teamNav = document.querySelector('[data-tab="team"]');
    if (teamNav) {
        teamNav.addEventListener('click', () => {
            loadTeam();
        });
    }
});
