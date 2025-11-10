/**
 * Dashboard y Sistema de Recordatorios
 * Executive Performance - CRM
 */

// Variables globales
let reminders = [];
let allClients = [];

// Elementos del DOM
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const reminderForm = document.getElementById('reminderForm');
const remindersList = document.getElementById('remindersList');
const notificationBell = document.getElementById('notificationBell');
const notificationBadge = document.getElementById('notificationBadge');

// Event Listeners
tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const tabName = e.target.onclick.toString().match(/'([^']+)'/)[1];
        switchTab(tabName);
    });
});

reminderForm.addEventListener('submit', handleReminderSubmit);
notificationBell.addEventListener('click', showNotifications);

// Cargar recordatorios desde localStorage
function loadReminders() {
    const saved = localStorage.getItem('reminders');
    reminders = saved ? JSON.parse(saved) : [];
    displayReminders();
}

// Guardar recordatorios en localStorage
function saveReminders() {
    localStorage.setItem('reminders', JSON.stringify(reminders));
    updateNotificationBadge();
}

// Cambiar de pestaña
window.switchTab = function(tabName) {
    // Ocultar todos los tab-content
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Desactivar todos los botones
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar tab activo
    const activeTab = document.getElementById(`tab-${tabName}`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Activar botón
    const activeBtn = document.querySelector(`button[onclick="switchTab('${tabName}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Cargar datos si es dashboard
    if (tabName === 'dashboard') {
        loadMetricsData();
    }
};

/**
 * Cargar datos del dashboard
 */
async function loadMetricsData() {
    // Los datos ya están disponibles desde clients.js
    // Aquí simplemente los mostramos
    updateMetrics();
    drawCharts();
}

/**
 * Actualizar métricas
 */
function updateMetrics() {
    // Obtener datos de la página actual
    const totalElement = document.getElementById('totalClients');
    const platinoElement = document.getElementById('totalPlatino');
    const oroElement = document.getElementById('totalOro');
    const plataElement = document.getElementById('totalPlata');
    
    // Actualizar tarjetas de métricas
    document.getElementById('metricTotal').textContent = totalElement?.textContent || '0';
    document.getElementById('metricPlatino').textContent = platinoElement?.textContent || '0';
    document.getElementById('metricOro').textContent = oroElement?.textContent || '0';
    document.getElementById('metricPlata').textContent = plataElement?.textContent || '0';
}

/**
 * Dibujar gráficos con Chart.js (CDN)
 */
function drawCharts() {
    // Agregar script de Chart.js si no existe
    if (!window.Chart) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => {
            createCharts();
        };
        document.head.appendChild(script);
    } else {
        createCharts();
    }
}

/**
 * Crear gráficos
 */
function createCharts() {
    const total = parseInt(document.getElementById('metricTotal').textContent) || 0;
    const platino = parseInt(document.getElementById('metricPlatino').textContent) || 0;
    const oro = parseInt(document.getElementById('metricOro').textContent) || 0;
    const plata = parseInt(document.getElementById('metricPlata').textContent) || 0;
    const bronce = total - platino - oro - plata;
    
    // Gráfico 1: Distribución por Segmento
    const ctxSegment = document.getElementById('segmentChart');
    if (ctxSegment && ctxSegment.chart) {
        ctxSegment.chart.destroy();
    }
    
    new Chart(ctxSegment, {
        type: 'doughnut',
        data: {
            labels: ['Platino', 'Oro', 'Plata', 'Bronce'],
            datasets: [{
                data: [platino, oro, plata, bronce],
                backgroundColor: ['#9e9e9e', '#FFA500', '#c0c0c0', '#cd7f32'],
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    // Gráfico 2: Ejemplo Score promedio (puedes adaptarlo)
    const ctxScore = document.getElementById('scoreChart');
    if (ctxScore && ctxScore.chart) {
        ctxScore.chart.destroy();
    }
    
    new Chart(ctxScore, {
        type: 'bar',
        data: {
            labels: ['Platino', 'Oro', 'Plata', 'Bronce'],
            datasets: [{
                label: 'Cantidad de Clientes',
                data: [platino, oro, plata, bronce],
                backgroundColor: ['#9e9e9e', '#FFA500', '#c0c0c0', '#cd7f32']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Manejar envío de recordatorio
 */
function handleReminderSubmit(e) {
    e.preventDefault();
    
    const date = document.getElementById('reminderDate').value;
    const time = document.getElementById('reminderTime').value;
    const title = document.getElementById('reminderTitle').value;
    const description = document.getElementById('reminderDescription').value;
    const client = document.getElementById('reminderClient').value;
    
    const reminder = {
        id: Date.now(),
        date,
        time,
        title,
        description,
        client,
        createdAt: new Date().toISOString(),
        completed: false
    };
    
    reminders.push(reminder);
    saveReminders();
    reminderForm.reset();
    
    showMessage('✅ Recordatorio guardado', 'success');
}

/**
 * Mostrar recordatorios
 */
function displayReminders() {
    if (reminders.length === 0) {
        remindersList.innerHTML = '<p class="empty-message">No hay recordatorios. ¡Crea uno nuevo!</p>';
        return;
    }
    
    // Ordenar por fecha
    const sorted = [...reminders].sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
    
    const today = new Date().toISOString().split('T')[0];
    
    const html = sorted.map(reminder => {
        const reminderDate = reminder.date;
        let statusClass = 'upcoming';
        
        if (reminderDate < today) {
            statusClass = 'overdue';
        } else if (reminderDate === today) {
            statusClass = 'today';
        }
        
        return `
            <div class="reminder-item ${statusClass}">
                <div class="reminder-header">
                    <h4 class="reminder-title">${reminder.title}</h4>
                    <div class="reminder-date">${formatReminderDate(reminder.date, reminder.time)}</div>
                </div>
                <p class="reminder-description">${reminder.description || 'Sin descripción'}</p>
                ${reminder.client ? `<p class="reminder-client">👤 ${reminder.client}</p>` : ''}
                <div class="reminder-actions">
                    <button onclick="completeReminder(${reminder.id})" class="btn btn-small btn-success">✓ Completado</button>
                    <button onclick="deleteReminder(${reminder.id})" class="btn btn-small btn-danger">🗑️ Eliminar</button>
                </div>
            </div>
        `;
    }).join('');
    
    remindersList.innerHTML = html;
}

/**
 * Marcar recordatorio como completado
 */
window.completeReminder = function(id) {
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
        reminder.completed = true;
        saveReminders();
        showMessage('✅ Recordatorio completado', 'success');
    }
};

/**
 * Eliminar recordatorio
 */
window.deleteReminder = function(id) {
    if (confirm('¿Estás seguro de eliminar este recordatorio?')) {
        reminders = reminders.filter(r => r.id !== id);
        saveReminders();
        showMessage('✅ Recordatorio eliminado', 'success');
    }
};

/**
 * Formatear fecha del recordatorio
 */
function formatReminderDate(date, time) {
    const reminderDate = new Date(`${date}T${time || '00:00'}`);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const reminderDateOnly = new Date(date);
    
    let label = '';
    if (date === today.toISOString().split('T')[0]) {
        label = 'HOY';
    } else if (date === tomorrow.toISOString().split('T')[0]) {
        label = 'MAÑANA';
    } else {
        label = reminderDate.toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric' });
    }
    
    const timeStr = time ? reminderDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '';
    
    return `${label} ${timeStr}`.trim();
}

/**
 * Actualizar badge de notificaciones
 */
function updateNotificationBadge() {
    const pending = reminders.filter(r => !r.completed).length;
    const today = new Date().toISOString().split('T')[0];
    const todayReminders = reminders.filter(r => r.date === today && !r.completed);
    
    if (todayReminders.length > 0) {
        notificationBadge.textContent = todayReminders.length;
        notificationBadge.style.display = 'flex';
    } else {
        notificationBadge.style.display = 'none';
    }
}

/**
 * Mostrar notificaciones
 */
function showNotifications() {
    const today = new Date().toISOString().split('T')[0];
    const todayReminders = reminders.filter(r => r.date === today && !r.completed);
    
    if (todayReminders.length === 0) {
        alert('✅ No hay recordatorios para hoy');
        return;
    }
    
    let message = `📌 Recordatorios para hoy (${todayReminders.length}):\n\n`;
    todayReminders.forEach(r => {
        message += `• ${r.title}`;
        if (r.time) message += ` (${r.time})`;
        message += `\n  ${r.description || ''}\n\n`;
    });
    
    alert(message);
}

/**
 * Mostrar mensaje (usar función existente si está disponible)
 */
function showMessage(message, type = 'info') {
    const messageBox = document.getElementById('messageBox');
    if (messageBox) {
        messageBox.textContent = message;
        messageBox.className = `message-box message-${type}`;
        messageBox.classList.remove('hidden');
        
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 3000);
    }
}

// Cargar recordatorios al iniciar
window.addEventListener('load', () => {
    loadReminders();
    updateNotificationBadge();
    
    // Actualizar badge cada minuto
    setInterval(updateNotificationBadge, 60000);
});

// Actualizar datos cuando cambian los clientes
function updateDashboardData() {
    if (document.getElementById('tab-dashboard').classList.contains('active')) {
        loadMetricsData();
    }
}
