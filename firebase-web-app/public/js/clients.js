/**
 * Sistema de Gestión de Clientes ICE
 * Executive Performance - CRM
 */

import { auth, db, functions } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    getDocs, 
    getDoc,
    doc, 
    updateDoc, 
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { httpsCallable } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-functions.js';

// Variables globales
let currentUser = null;
let currentEditId = null;
let allClients = [];
let filteredClients = [];
let selectedClientId = null;

// Variables de paginación
let currentPage = 1;
let itemsPerPage = 5;
let totalPages = 1;

// Elementos del DOM
const btnAddClient = document.getElementById('btnAddClient');
const btnLoadClients = document.getElementById('btnLoadClients');
const btnCancelForm = document.getElementById('btnCancelForm');
const btnSearch = document.getElementById('btnSearch');
const btnClearSearch = document.getElementById('btnClearSearch');
const formSection = document.getElementById('formSection');
const clientForm = document.getElementById('clientForm');
const clientsContainer = document.getElementById('clientsContainer');
const messageBox = document.getElementById('messageBox');
const searchInput = document.getElementById('searchInput');
const filterSegment = document.getElementById('filterSegment');
const filterEstadoPlan = document.getElementById('filterEstadoPlan');
const btnExportClients = document.getElementById('btnExportClients');
const btnDeleteAllMyClients = document.getElementById('btnDeleteAllMyClients');

// Elementos de paginación
const paginationControls = document.getElementById('paginationControls');
const btnPrevPage = document.getElementById('btnPrevPage');
const btnNextPage = document.getElementById('btnNextPage');
const itemsPerPageSelect = document.getElementById('itemsPerPage');
const pageNumbers = document.getElementById('pageNumbers');

// Modal
const clientDetailModal = document.getElementById('clientDetailModal');
const closeModal = document.getElementById('closeModal');
const btnEditClient = document.getElementById('btnEditClient');
const btnDeleteClient = document.getElementById('btnDeleteClient');
const interactionForm = document.getElementById('interactionForm');

// Esperar autenticación
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        loadClients();
    }
});

// Event Listeners
if (btnDeleteAllMyClients) {
    btnDeleteAllMyClients.addEventListener('click', async () => {
        if (!currentUser) {
            alert('No se ha autenticado ningún usuario.');
            return;
        }
        if (!confirm('¿Seguro que quieres borrar TODOS tus clientes? Esta acción no se puede deshacer.')) return;
        try {
            // Buscar todos los clientes del usuario actual en la colección correcta
            const q = query(collection(db, 'clients'), where('executiveId', '==', currentUser.uid));
            const snapshot = await getDocs(q);
            let deleted = 0;
            for (const docSnap of snapshot.docs) {
                await deleteDoc(docSnap.ref);
                deleted++;
            }
            alert(`Se han borrado ${deleted} clientes asociados a tu usuario.`);
            loadClients();
        } catch (err) {
            console.error('Error borrando clientes:', err);
            alert('Ocurrió un error al borrar los clientes.');
        }
    });
}
if (btnExportClients) {
    btnExportClients.addEventListener('click', () => {
        if (!window.XLSX) {
            alert('No se pudo cargar la librería de exportación.');
            return;
        }
        // Preparar datos para exportar
        const exportData = filteredClients.map(client => ({
            'ID': client.id,
            'Nombre': client.name,
            'Cédula': client.cedula,
            'Email': client.email || '',
            'Segmento': client.segmento,
            'Score': client.score,
            'Categoría': client.categoria,
            'Estado': client.estado,
            'Móviles': Array.isArray(client.serviciosMoviles) ? client.serviciosMoviles.join(', ') : client.serviciosMoviles,
            'Fijos': Array.isArray(client.serviciosFijos) ? client.serviciosFijos.join(', ') : client.serviciosFijos,
            'Última actualización': client.updatedAt ? (window.safeFormatDate ? window.safeFormatDate(client.updatedAt) : formatDate(client.updatedAt)) : ''
        }));
        const ws = window.XLSX.utils.json_to_sheet(exportData);
        const wb = window.XLSX.utils.book_new();
        window.XLSX.utils.book_append_sheet(wb, ws, 'Clientes');
        window.XLSX.writeFile(wb, 'clientes.xlsx');
    });
}
btnAddClient.addEventListener('click', showForm);
btnLoadClients.addEventListener('click', loadClients);
btnCancelForm.addEventListener('click', hideForm);
clientForm.addEventListener('submit', handleClientSubmit);
btnSearch.addEventListener('click', searchClients);
btnClearSearch.addEventListener('click', clearSearch);
filterSegment.addEventListener('change', filterBySegment);
closeModal.addEventListener('click', hideModal);
btnEditClient.addEventListener('click', editSelectedClient);
btnDeleteClient.addEventListener('click', deleteSelectedClient);
interactionForm.addEventListener('submit', handleInteractionSubmit);

// Event listeners de paginación
btnPrevPage.addEventListener('click', previousPage);
btnNextPage.addEventListener('click', nextPage);
itemsPerPageSelect.addEventListener('change', changeItemsPerPage);

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
 * Mostrar formulario
 */
function showForm() {
    formSection.classList.remove('hidden');
    currentEditId = null;
    clientForm.reset();
    document.getElementById('formTitle').textContent = 'Agregar Nuevo Cliente';
    window.scrollTo({ top: formSection.offsetTop - 20, behavior: 'smooth' });
}

/**
 * Ocultar formulario
 */
function hideForm() {
    formSection.classList.add('hidden');
    currentEditId = null;
    clientForm.reset();
}

/**
 * Cargar todos los clientes del ejecutivo
 */
async function loadClients() {
    if (!currentUser) return;
    
    try {
        showMessage('⏳ Cargando clientes...', 'info');
        
        const q = query(
            collection(db, 'clients'),
            where('executiveId', '==', currentUser.uid),
            orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        allClients = [];
        
        querySnapshot.forEach((doc) => {
            allClients.push({ id: doc.id, ...doc.data() });
        });
        
        displayClients(allClients);
        updateStats(allClients);
        showMessage(`✅ ${allClients.length} clientes cargados`, 'success');
        
    } catch (error) {
        console.error('Error al cargar clientes:', error);
        showMessage(`❌ Error: ${error.message}`, 'error');
    }
}

/**
 * Mostrar clientes en la interfaz con paginación
 */
function displayClients(clients) {
    filteredClients = clients;
    currentPage = 1;
    
    if (clients.length === 0) {
        clientsContainer.innerHTML = '<p class="empty-message">No se encontraron clientes.</p>';
        paginationControls.classList.add('hidden');
        return;
    }
    
    // Calcular páginas
    totalPages = Math.ceil(clients.length / itemsPerPage);
    
    // Mostrar paginación si hay más de una página
    if (totalPages > 1) {
        paginationControls.classList.remove('hidden');
    } else {
        paginationControls.classList.add('hidden');
    }
    
    showPage(currentPage);
}

/**
 * Mostrar página específica
 */
function showPage(pageNum) {
    const start = (pageNum - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageClients = filteredClients.slice(start, end);
    
    // Renderizar clientes con validación segura
    const clientsHTML = pageClients.map(client => {
        // Usar validación segura para todos los campos
        const safeClient = window.safeClientDisplay ? window.safeClientDisplay(client) : client;
        return `
        <div class="client-card segment-${safeClient.segmento.toLowerCase()}" data-id="${safeClient.id}" data-client-id="${safeClient.id}">
            <div class="client-card-header">
                <h3>${safeClient.name}</h3>
                <span class="segment-badge ${safeClient.segmento.toLowerCase()}">${safeClient.segmento}</span>
            </div>
            <div class="client-card-body">
                <p><strong>📄 Cédula:</strong> ${safeClient.cedula}</p>
                <p><strong>📱 Móviles:</strong> ${window.safeFormatArray ? window.safeFormatArray(client.serviciosMoviles) : formatArray(client.serviciosMoviles)}</p>
                <p><strong>📞 Fijos:</strong> ${window.safeFormatArray ? window.safeFormatArray(client.serviciosFijos) : formatArray(client.serviciosFijos)}</p>
                <p><strong>⭐ Score:</strong> ${safeClient.score} | <strong>Categoría:</strong> ${safeClient.categoria}</p>
                <p><strong>📋 Estado:</strong> ${safeClient.estado}</p>
            </div>
            <div class="client-card-footer">
                <button onclick="viewClientDetail('${safeClient.id}')" class="btn btn-small btn-primary">👁️ Ver Detalle</button>
                <small>Última actualización: ${window.safeFormatDate ? window.safeFormatDate(client.updatedAt) : formatDate(client.updatedAt)}</small>
            </div>
        </div>`
    }).join('');
    
    clientsContainer.innerHTML = clientsHTML || '<p class="empty-message">No hay clientes en esta página.</p>';
    
    // Actualizar información de paginación
    updatePaginationInfo(start, end);
}

/**
 * Actualizar información de paginación
 */
function updatePaginationInfo(start, end) {
    document.getElementById('showingStart').textContent = filteredClients.length > 0 ? start + 1 : 0;
    document.getElementById('showingEnd').textContent = Math.min(end, filteredClients.length);
    document.getElementById('totalResults').textContent = filteredClients.length;
    
    updatePageButtons();
}

/**
 * Actualizar botones de página
 */
function updatePageButtons() {
    // Habilitar/deshabilitar botones de navegación
    btnPrevPage.disabled = currentPage === 1;
    btnNextPage.disabled = currentPage === totalPages;
    
    // Generar números de página
    const pageButtonsHTML = generatePageButtons();
    pageNumbers.innerHTML = pageButtonsHTML;
}

/**
 * Generar botones de números de página
 */
function generatePageButtons() {
    let html = '';
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
    }
    
    // Botón primera página
    if (start > 1) {
        html += `<button class="page-btn" onclick="goToPage(1)">1</button>`;
        if (start > 2) {
            html += `<span class="page-ellipsis">...</span>`;
        }
    }
    
    // Botones de página
    for (let i = start; i <= end; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    // Botón última página
    if (end < totalPages) {
        if (end < totalPages - 1) {
            html += `<span class="page-ellipsis">...</span>`;
        }
        html += `<button class="page-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    
    return html;
}

/**
 * Ir a página específica
 */
window.goToPage = function(pageNum) {
    if (pageNum >= 1 && pageNum <= totalPages) {
        currentPage = pageNum;
        showPage(currentPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

/**
 * Página anterior
 */
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        showPage(currentPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Página siguiente
 */
function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        showPage(currentPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Cambiar elementos por página
 */
function changeItemsPerPage() {
    itemsPerPage = parseInt(itemsPerPageSelect.value);
    currentPage = 1;
    displayClients(filteredClients);
}

/**
 * Actualizar estadísticas
 */
function updateStats(clients) {
    const updateElement = (id, value) => {
        const elem = document.getElementById(id);
        if (elem) elem.textContent = value;
    };
    
    updateElement('totalClients', clients.length);
    updateElement('totalPlatino', clients.filter(c => c.segmento === 'PLATINO').length);
    updateElement('totalOro', clients.filter(c => c.segmento === 'ORO').length);
    updateElement('totalPlata', clients.filter(c => c.segmento === 'PLATA').length);
    updateElement('totalBronce', clients.filter(c => c.segmento === 'BRONCE').length);
    updateElement('totalBlack', clients.filter(c => c.segmento === 'BLACK').length);
}

/**
 * Guardar o actualizar cliente
 */
async function handleClientSubmit(e) {
    e.preventDefault();
    
    if (!currentUser) return;
    
    const clientData = {
        cedula: document.getElementById('cedula').value.trim(),
        name: document.getElementById('nombre').value.trim().toUpperCase(),
        email: document.getElementById('email').value.trim(),
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        domicilio: document.getElementById('domicilio').value.trim(),
        serviciosMoviles: document.getElementById('serviciosMoviles').value.split(',').map(s => s.trim()).filter(s => s),
        serviciosFijos: document.getElementById('serviciosFijos').value.split(',').map(s => s.trim()).filter(s => s),
        tipoPlan: document.getElementById('tipoPlan').value.trim(),
        estadoPlan: document.getElementById('estadoPlan').value,
        segmento: document.getElementById('segmento').value,
        puntajeScore: parseInt(document.getElementById('puntajeScore').value) || 0,
        categoriaCrediticia: document.getElementById('categoriaCrediticia').value,
        notas: document.getElementById('notas').value.trim(),
        executiveId: currentUser.uid,
        executiveName: currentUser.displayName || currentUser.email,
        updatedAt: Timestamp.now()
    };
    
    try {
        if (currentEditId) {
            // Actualizar cliente
            const docRef = doc(db, 'clients', currentEditId);
            const docSnap = await getDoc(docRef);
            const clientAnterior = docSnap.data();
            
            await updateDoc(docRef, clientData);
            
            // Registrar venta si cambió el plan
            if (clientAnterior.tipoPlan !== clientData.tipoPlan || 
                clientAnterior.segmento !== clientData.segmento) {
                await window.registerPlanUpdate?.(clientData, clientAnterior.tipoPlan, currentEditId);
            }
            
            showMessage('✅ Cliente actualizado exitosamente', 'success');
        } else {
            // Crear cliente nuevo
            clientData.createdAt = Timestamp.now();
            clientData.interactions = [];
            const newDoc = await addDoc(collection(db, 'clients'), clientData);
            
            // Registrar venta nueva
            await window.registerNewClientSale?.(clientData, newDoc.id);
            
            showMessage('✅ Cliente agregado exitosamente', 'success');
        }
        
        hideForm();
        loadClients();
        
    } catch (error) {
        console.error('Error al guardar cliente:', error);
        showMessage(`❌ Error: ${error.message}`, 'error');
    }
}

/**
 * Ver detalle del cliente
 */
window.viewClientDetail = async function(clientId) {
    try {
        const docSnap = await getDoc(doc(db, 'clients', clientId));
        
        if (docSnap.exists()) {
            const client = { id: docSnap.id, ...docSnap.data() };
            selectedClientId = clientId;
            displayClientDetail(client);
            clientDetailModal.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage(`❌ Error: ${error.message}`, 'error');
    }
};

/**
 * Mostrar detalle del cliente en modal
 */
function displayClientDetail(client) {
    document.getElementById('modalClientName').textContent = client.name;
    
    const interactions = client.interactions || [];
    const interactionsHTML = interactions.length > 0 
        ? interactions.map(int => `
            <div class="interaction-item">
                <strong>${int.type}</strong> - ${int.result} 
                <br><small>${formatDate(int.date)}</small>
                <p>${int.notes}</p>
            </div>
        `).join('')
        : '<p>No hay interacciones registradas</p>';
    
    document.getElementById('clientDetailContent').innerHTML = `
        <div class="client-detail-info">
            <h3>📋 Información Personal</h3>
            <p><strong>Cédula:</strong> ${client.cedula}</p>
            <p><strong>Email:</strong> ${client.email || 'No registrado'}</p>
            <p><strong>Fecha Nacimiento:</strong> ${client.fechaNacimiento || 'No registrado'}</p>
            <p><strong>Domicilio:</strong> ${client.domicilio || 'No registrado'}</p>
            
            <h3>📱 Servicios</h3>
            <p><strong>Móviles:</strong> ${formatArray(client.serviciosMoviles)}</p>
            <p><strong>Fijos:</strong> ${formatArray(client.serviciosFijos)}</p>
            <p><strong>Tipo Plan:</strong> ${client.tipoPlan || 'No especificado'}</p>
            <p><strong>Estado:</strong> ${client.estadoPlan}</p>
            
            <h3>⭐ Clasificación</h3>
            <p><strong>Segmento:</strong> <span class="segment-badge ${client.segmento.toLowerCase()}">${client.segmento}</span></p>
            <p><strong>Score:</strong> ${client.puntajeScore || 'N/A'}</p>
            <p><strong>Categoría:</strong> ${client.categoriaCrediticia || 'N/A'}</p>
            <p><strong>Notas:</strong> ${client.notas || 'Ninguna'}</p>
            
            <h3>📞 Historial de Interacciones</h3>
            ${interactionsHTML}
        </div>
    `;
}

/**
 * Editar cliente seleccionado
 */
function editSelectedClient() {
    if (!selectedClientId) return;
    
    getDoc(doc(db, 'clients', selectedClientId)).then(docSnap => {
        if (docSnap.exists()) {
            const client = docSnap.data();
            currentEditId = selectedClientId;
            
            // Llenar formulario
            document.getElementById('cedula').value = client.cedula;
            document.getElementById('nombre').value = client.name;
            document.getElementById('email').value = client.email || '';
            document.getElementById('fechaNacimiento').value = client.fechaNacimiento || '';
            document.getElementById('domicilio').value = client.domicilio || '';
            document.getElementById('serviciosMoviles').value = client.serviciosMoviles.join(', ');
            document.getElementById('serviciosFijos').value = client.serviciosFijos.join(', ');
            document.getElementById('tipoPlan').value = client.tipoPlan || '';
            document.getElementById('estadoPlan').value = client.estadoPlan;
            document.getElementById('segmento').value = client.segmento;
            document.getElementById('puntajeScore').value = client.puntajeScore || '';
            document.getElementById('categoriaCrediticia').value = client.categoriaCrediticia || '';
            document.getElementById('notas').value = client.notas || '';
            
            document.getElementById('formTitle').textContent = 'Editar Cliente';
            formSection.classList.remove('hidden');
            hideModal();
            window.scrollTo({ top: formSection.offsetTop - 20, behavior: 'smooth' });
        }
    });
}

/**
 * Eliminar cliente
 */
async function deleteSelectedClient() {
    if (!selectedClientId) return;
    
    if (!confirm('¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        await deleteDoc(doc(db, 'clients', selectedClientId));
        showMessage('✅ Cliente eliminado exitosamente', 'success');
        hideModal();
        loadClients();
    } catch (error) {
        console.error('Error:', error);
        showMessage(`❌ Error: ${error.message}`, 'error');
    }
}

/**
 * Guardar interacción
 */
async function handleInteractionSubmit(e) {
    e.preventDefault();
    
    if (!selectedClientId) return;
    
    const interaction = {
        type: document.getElementById('interactionType').value,
        notes: document.getElementById('interactionNotes').value,
        result: document.getElementById('interactionResult').value,
        date: Timestamp.now(),
        executiveName: currentUser.displayName || currentUser.email
    };
    
    try {
        const clientRef = doc(db, 'clients', selectedClientId);
        const docSnap = await getDoc(clientRef);
        
        if (docSnap.exists()) {
            const client = docSnap.data();
            const interactions = client.interactions || [];
            interactions.push(interaction);
            
            await updateDoc(clientRef, { 
                interactions: interactions,
                updatedAt: Timestamp.now()
            });
            
            // ✅ NUEVO: Si la interacción es exitosa, registrar como venta
            if (interaction.result.toLowerCase() === 'exitoso') {
                try {
                    const recordSuccessfulSale = httpsCallable(functions, 'recordSuccessfulSale');
                    await recordSuccessfulSale({
                        clientId: selectedClientId,
                        segmento: client.segmento
                    });
                    console.log('✅ Venta registrada en métricas');
                } catch (saleError) {
                    console.error('⚠️ Error registrando venta:', saleError);
                    // No bloquear - la interacción ya se guardó
                }
            }
            
            showMessage('✅ Interacción registrada exitosamente', 'success');
            interactionForm.reset();
            viewClientDetail(selectedClientId); // Recargar detalle
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage(`❌ Error: ${error.message}`, 'error');
    }
}

/**
 * Buscar clientes
 */
function searchClients() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const estadoPlan = filterEstadoPlan ? filterEstadoPlan.value : '';

    let filtered = allClients;
    if (searchTerm) {
        filtered = filtered.filter(client => {
            const safeClient = window.safeClientDisplay ? window.safeClientDisplay(client) : client;
            return (
                safeClient.name.toLowerCase().includes(searchTerm) ||
                safeClient.cedula.includes(searchTerm) ||
                (client.serviciosMoviles && client.serviciosMoviles.some(num => num && num.includes(searchTerm))) ||
                (client.serviciosFijos && client.serviciosFijos.some(num => num && num.includes(searchTerm)))
            );
        });
    }
    if (estadoPlan) {
        filtered = filtered.filter(client => client.estadoPlan && client.estadoPlan.toUpperCase() === estadoPlan);
    }
    displayClients(filtered);
    showMessage(`🔍 ${filtered.length} cliente(s) encontrado(s)`, 'info');
if (filterEstadoPlan) {
    filterEstadoPlan.addEventListener('change', searchClients);
}
}

/**
 * Limpiar búsqueda
 */
function clearSearch() {
    searchInput.value = '';
    filterSegment.value = '';
    displayClients(allClients);
    showMessage('✅ Búsqueda limpiada', 'info');
}

/**
 * Filtrar por segmento
 */
function filterBySegment() {
    const segment = filterSegment.value;
    
    if (!segment) {
        displayClients(allClients);
        return;
    }
    
    const filtered = allClients.filter(client => client.segmento === segment);
    displayClients(filtered);
    showMessage(`✅ Filtrado por: ${segment} (${filtered.length} cliente(s))`, 'info');
}

/**
 * Ocultar modal
 */
function hideModal() {
    clientDetailModal.classList.add('hidden');
    selectedClientId = null;
}

/**
 * Formatear array
 */
function formatArray(arr) {
    return arr && arr.length > 0 ? arr.join(', ') : 'Ninguno';
}

/**
 * Formatear fecha
 */
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('es-ES');
}
