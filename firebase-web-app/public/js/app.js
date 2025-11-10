/**
 * Aplicación Frontend para interactuar con Firebase
 */

// Configuración de la API
const API_URL = '/api';

// Estado de la aplicación
let currentEditId = null;

// Elementos del DOM
const btnLoadData = document.getElementById('btnLoadData');
const btnShowForm = document.getElementById('btnShowForm');
const btnClearData = document.getElementById('btnClearData');
const btnCancelForm = document.getElementById('btnCancelForm');
const formSection = document.getElementById('formSection');
const itemForm = document.getElementById('itemForm');
const dataContainer = document.getElementById('dataContainer');
const messageBox = document.getElementById('messageBox');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    btnLoadData.addEventListener('click', loadData);
    btnShowForm.addEventListener('click', showForm);
    btnClearData.addEventListener('click', clearDataDisplay);
    btnCancelForm.addEventListener('click', hideForm);
    itemForm.addEventListener('submit', handleFormSubmit);

    // Cargar datos al iniciar
    checkApiHealth();
});

/**
 * Verificar que la API esté funcionando
 */
async function checkApiHealth() {
    try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();
        if (data.status === 'OK') {
            showMessage('✅ Conexión con la API establecida', 'success');
        }
    } catch (error) {
        showMessage('❌ Error al conectar con la API', 'error');
        console.error('Error:', error);
    }
}

/**
 * Cargar datos desde la API
 */
async function loadData() {
    try {
        showMessage('⏳ Cargando datos...', 'info');
        
        const response = await fetch(`${API_URL}/items`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Error al cargar datos');
        }

        if (result.success) {
            displayData(result.data);
            showMessage(`✅ ${result.data.length} items cargados exitosamente`, 'success');
        }
    } catch (error) {
        showMessage(`❌ Error: ${error.message}`, 'error');
        console.error('Error al cargar datos:', error);
    }
}

/**
 * Mostrar datos en el contenedor
 */
function displayData(items) {
    if (items.length === 0) {
        dataContainer.innerHTML = '<p class="empty-message">No hay items en la base de datos.</p>';
        return;
    }

    const itemsHTML = items.map(item => `
        <div class="item-card" data-id="${item.id}">
            <div class="item-header">
                <h3>${item.name || 'Sin nombre'}</h3>
                <span class="status status-${item.status || 'pendiente'}">${item.status || 'pendiente'}</span>
            </div>
            <div class="item-body">
                <p>${item.description || 'Sin descripción'}</p>
                <small class="item-date">
                    Creado: ${formatDate(item.createdAt)}
                </small>
            </div>
            <div class="item-actions">
                <button onclick="editItem('${item.id}')" class="btn btn-small btn-primary">✏️ Editar</button>
                <button onclick="deleteItem('${item.id}')" class="btn btn-small btn-danger">🗑️ Eliminar</button>
            </div>
        </div>
    `).join('');

    dataContainer.innerHTML = itemsHTML;
}

/**
 * Mostrar formulario
 */
function showForm() {
    formSection.classList.remove('hidden');
    currentEditId = null;
    itemForm.reset();
    formSection.querySelector('h2').textContent = 'Agregar Nuevo Item';
}

/**
 * Ocultar formulario
 */
function hideForm() {
    formSection.classList.add('hidden');
    currentEditId = null;
    itemForm.reset();
}

/**
 * Manejar envío del formulario
 */
async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('itemName').value,
        description: document.getElementById('itemDescription').value,
        status: document.getElementById('itemStatus').value
    };

    try {
        if (currentEditId) {
            await updateItem(currentEditId, formData);
        } else {
            await createItem(formData);
        }
        
        hideForm();
        loadData();
    } catch (error) {
        showMessage(`❌ Error: ${error.message}`, 'error');
    }
}

/**
 * Crear un nuevo item
 */
async function createItem(data) {
    const response = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Error al crear el item');
    }

    showMessage('✅ Item creado exitosamente', 'success');
    return result;
}

/**
 * Editar un item existente
 */
async function editItem(id) {
    try {
        const response = await fetch(`${API_URL}/items/${id}`);
        const result = await response.json();

        if (result.success && result.data) {
            const item = result.data;
            document.getElementById('itemName').value = item.name || '';
            document.getElementById('itemDescription').value = item.description || '';
            document.getElementById('itemStatus').value = item.status || 'pendiente';
            
            currentEditId = id;
            formSection.querySelector('h2').textContent = 'Editar Item';
            formSection.classList.remove('hidden');
        }
    } catch (error) {
        showMessage(`❌ Error al cargar el item: ${error.message}`, 'error');
    }
}

/**
 * Actualizar un item
 */
async function updateItem(id, data) {
    const response = await fetch(`${API_URL}/items/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Error al actualizar el item');
    }

    showMessage('✅ Item actualizado exitosamente', 'success');
    return result;
}

/**
 * Eliminar un item
 */
async function deleteItem(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este item?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/items/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Error al eliminar el item');
        }

        showMessage('✅ Item eliminado exitosamente', 'success');
        loadData();
    } catch (error) {
        showMessage(`❌ Error: ${error.message}`, 'error');
    }
}

/**
 * Limpiar visualización de datos
 */
function clearDataDisplay() {
    dataContainer.innerHTML = '<p class="empty-message">No hay datos para mostrar. Haz clic en "Cargar Datos" para comenzar.</p>';
    showMessage('🗑️ Vista limpiada', 'info');
}

/**
 * Mostrar mensaje
 */
function showMessage(message, type = 'info') {
    messageBox.textContent = message;
    messageBox.className = `message-box message-${type}`;
    messageBox.classList.remove('hidden');

    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 5000);
}

/**
 * Formatear fecha
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES');
}