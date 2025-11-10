// Clients Management Module

// Load clients list
async function loadClients() {
    try {
        const tbody = document.getElementById('clients-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Cargando...</td></tr>';
        
        const snapshot = await database.ref('clients').once('value');
        const clients = snapshot.val() || {};
        
        tbody.innerHTML = '';
        
        if (Object.keys(clients).length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay clientes registrados</td></tr>';
            return;
        }
        
        Object.entries(clients).forEach(([id, client]) => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${client.name || '-'}</td>
                <td>${client.email || '-'}</td>
                <td>${client.phone || '-'}</td>
                <td>${client.company || '-'}</td>
                <td><span class="status-badge ${client.status || 'active'}">${client.status || 'activo'}</span></td>
                <td>
                    <button class="action-btn edit" onclick="editClient('${id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteClient('${id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
        });
    } catch (error) {
        console.error('Error loading clients:', error);
        showNotification('Error al cargar clientes', 'error');
    }
}

// Add client button handler
document.getElementById('add-client-btn')?.addEventListener('click', () => {
    showClientModal();
});

// Show client modal
function showClientModal(clientId = null) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <h2>${clientId ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
        <form id="client-form">
            <div class="form-group">
                <label>Nombre Completo *</label>
                <input type="text" id="client-name" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Email *</label>
                <input type="email" id="client-email" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Teléfono</label>
                <input type="tel" id="client-phone" class="form-control">
            </div>
            <div class="form-group">
                <label>Empresa</label>
                <input type="text" id="client-company" class="form-control">
            </div>
            <div class="form-group">
                <label>Estado</label>
                <select id="client-status" class="form-control">
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="pending">Pendiente</option>
                </select>
            </div>
            <button type="submit" class="btn-primary">
                <i class="fas fa-save"></i> Guardar
            </button>
        </form>
    `;
    
    modal.style.display = 'block';
    
    // Load client data if editing
    if (clientId) {
        loadClientData(clientId);
    }
    
    // Handle form submission
    document.getElementById('client-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveClient(clientId);
    });
}

// Load client data for editing
async function loadClientData(clientId) {
    try {
        const snapshot = await database.ref('clients/' + clientId).once('value');
        const client = snapshot.val();
        
        if (client) {
            document.getElementById('client-name').value = client.name || '';
            document.getElementById('client-email').value = client.email || '';
            document.getElementById('client-phone').value = client.phone || '';
            document.getElementById('client-company').value = client.company || '';
            document.getElementById('client-status').value = client.status || 'active';
        }
    } catch (error) {
        console.error('Error loading client:', error);
    }
}

// Save client
async function saveClient(clientId) {
    const clientData = {
        name: document.getElementById('client-name').value,
        email: document.getElementById('client-email').value,
        phone: document.getElementById('client-phone').value,
        company: document.getElementById('client-company').value,
        status: document.getElementById('client-status').value,
        updatedAt: new Date().toISOString()
    };
    
    try {
        if (clientId) {
            // Update existing client
            await database.ref('clients/' + clientId).update(clientData);
            showNotification('Cliente actualizado exitosamente', 'success');
        } else {
            // Add new client
            clientData.createdAt = new Date().toISOString();
            await database.ref('clients').push(clientData);
            showNotification('Cliente agregado exitosamente', 'success');
            
            // Log activity
            await database.ref('activities').push({
                type: 'client',
                title: 'Nuevo Cliente',
                description: `Se agregó ${clientData.name}`,
                timestamp: new Date().toISOString()
            });
        }
        
        closeModal();
        loadClients();
    } catch (error) {
        console.error('Error saving client:', error);
        showNotification('Error al guardar cliente', 'error');
    }
}

// Edit client
function editClient(clientId) {
    showClientModal(clientId);
}

// Delete client
async function deleteClient(clientId) {
    if (!confirm('¿Está seguro de eliminar este cliente?')) return;
    
    try {
        await database.ref('clients/' + clientId).remove();
        showNotification('Cliente eliminado exitosamente', 'success');
        loadClients();
    } catch (error) {
        console.error('Error deleting client:', error);
        showNotification('Error al eliminar cliente', 'error');
    }
}

// Initialize clients tab
document.addEventListener('DOMContentLoaded', () => {
    const clientsNav = document.querySelector('[data-tab="clients"]');
    if (clientsNav) {
        clientsNav.addEventListener('click', () => {
            loadClients();
        });
    }
});
