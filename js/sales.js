// Sales Management Module - Automatic sales registration

// Load sales list
async function loadSales() {
    try {
        const tbody = document.getElementById('sales-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Cargando...</td></tr>';
        
        const snapshot = await database.ref('sales').once('value');
        const sales = snapshot.val() || {};
        
        tbody.innerHTML = '';
        
        if (Object.keys(sales).length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay ventas registradas</td></tr>';
            return;
        }
        
        Object.entries(sales).forEach(([id, sale]) => {
            const row = tbody.insertRow();
            const date = new Date(sale.date).toLocaleDateString('es');
            row.innerHTML = `
                <td>#${id.substring(0, 8)}</td>
                <td>${sale.clientName || '-'}</td>
                <td>$${parseFloat(sale.amount || 0).toLocaleString()}</td>
                <td>${date}</td>
                <td><span class="status-badge ${sale.status || 'active'}">${sale.status || 'activo'}</span></td>
                <td>
                    <button class="action-btn edit" onclick="editSale('${id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteSale('${id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
        });
    } catch (error) {
        console.error('Error loading sales:', error);
        showNotification('Error al cargar ventas', 'error');
    }
}

// Add sale button handler
document.getElementById('add-sale-btn')?.addEventListener('click', () => {
    showSaleModal();
});

// Show sale modal
async function showSaleModal(saleId = null) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    // Get clients list for dropdown
    const clientsSnapshot = await database.ref('clients').once('value');
    const clients = clientsSnapshot.val() || {};
    
    let clientOptions = '<option value="">Seleccionar cliente</option>';
    Object.entries(clients).forEach(([id, client]) => {
        clientOptions += `<option value="${id}">${client.name}</option>`;
    });
    
    modalBody.innerHTML = `
        <h2>${saleId ? 'Editar Venta' : 'Registrar Venta'}</h2>
        <form id="sale-form">
            <div class="form-group">
                <label>Cliente *</label>
                <select id="sale-client" class="form-control" required>
                    ${clientOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Monto *</label>
                <input type="number" id="sale-amount" class="form-control" step="0.01" required>
            </div>
            <div class="form-group">
                <label>Fecha *</label>
                <input type="date" id="sale-date" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
            </div>
            <div class="form-group">
                <label>Descripción</label>
                <textarea id="sale-description" class="form-control" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label>Estado</label>
                <select id="sale-status" class="form-control">
                    <option value="active">Activo</option>
                    <option value="pending">Pendiente</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                </select>
            </div>
            <button type="submit" class="btn-primary">
                <i class="fas fa-save"></i> Guardar
            </button>
        </form>
    `;
    
    modal.style.display = 'block';
    
    // Load sale data if editing
    if (saleId) {
        loadSaleData(saleId);
    }
    
    // Handle form submission
    document.getElementById('sale-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveSale(saleId);
    });
}

// Load sale data for editing
async function loadSaleData(saleId) {
    try {
        const snapshot = await database.ref('sales/' + saleId).once('value');
        const sale = snapshot.val();
        
        if (sale) {
            document.getElementById('sale-client').value = sale.clientId || '';
            document.getElementById('sale-amount').value = sale.amount || '';
            document.getElementById('sale-date').value = sale.date?.split('T')[0] || '';
            document.getElementById('sale-description').value = sale.description || '';
            document.getElementById('sale-status').value = sale.status || 'active';
        }
    } catch (error) {
        console.error('Error loading sale:', error);
    }
}

// Save sale - Automatic registration
async function saveSale(saleId) {
    const clientId = document.getElementById('sale-client').value;
    const amount = document.getElementById('sale-amount').value;
    const date = document.getElementById('sale-date').value;
    const description = document.getElementById('sale-description').value;
    const status = document.getElementById('sale-status').value;
    
    try {
        // Get client info
        const clientSnapshot = await database.ref('clients/' + clientId).once('value');
        const client = clientSnapshot.val();
        
        const saleData = {
            clientId: clientId,
            clientName: client?.name || 'Cliente',
            amount: parseFloat(amount),
            date: date,
            description: description,
            status: status,
            userId: currentUser?.uid,
            updatedAt: new Date().toISOString()
        };
        
        if (saleId) {
            // Update existing sale
            await database.ref('sales/' + saleId).update(saleData);
            showNotification('Venta actualizada exitosamente', 'success');
        } else {
            // Add new sale - Automatic registration
            saleData.createdAt = new Date().toISOString();
            await database.ref('sales').push(saleData);
            showNotification('Venta registrada automáticamente', 'success');
            
            // Automatically log activity
            await database.ref('activities').push({
                type: 'sale',
                title: 'Nueva Venta',
                description: `Venta de $${amount} registrada para ${client?.name}`,
                timestamp: new Date().toISOString()
            });
            
            // Update notification count
            updateNotificationCount();
        }
        
        closeModal();
        loadSales();
    } catch (error) {
        console.error('Error saving sale:', error);
        showNotification('Error al guardar venta', 'error');
    }
}

// Edit sale
function editSale(saleId) {
    showSaleModal(saleId);
}

// Delete sale
async function deleteSale(saleId) {
    if (!confirm('¿Está seguro de eliminar esta venta?')) return;
    
    try {
        await database.ref('sales/' + saleId).remove();
        showNotification('Venta eliminada exitosamente', 'success');
        loadSales();
    } catch (error) {
        console.error('Error deleting sale:', error);
        showNotification('Error al eliminar venta', 'error');
    }
}

// Update notification count
async function updateNotificationCount() {
    try {
        const snapshot = await database.ref('activities').orderByChild('timestamp').limitToLast(10).once('value');
        const count = snapshot.numChildren();
        document.getElementById('notification-count').textContent = count;
    } catch (error) {
        console.error('Error updating notification count:', error);
    }
}

// Initialize sales tab
document.addEventListener('DOMContentLoaded', () => {
    const salesNav = document.querySelector('[data-tab="sales"]');
    if (salesNav) {
        salesNav.addEventListener('click', () => {
            loadSales();
        });
    }
});
