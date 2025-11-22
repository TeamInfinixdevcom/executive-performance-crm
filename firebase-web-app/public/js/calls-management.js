/**
 * Calls Management UI Module
 * Executive Performance - CRM
 */

let callsTracking = null;
let callsCharts = {};

/**
 * Initialize calls management
 */
async function initCallsManagement(userId) {
    callsTracking = new CallsTracking();
    await callsTracking.init(userId);
    
    setupCallsForm();
    loadCallsList();
    updateCallsStats();
    renderCallsCharts();
    setupCallsChartExpansion();
    populateClientsSelect();
}

/**
 * Setup calls form submission
 */
function setupCallsForm() {
    const form = document.getElementById('callsForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const clientId = document.getElementById('callClientId').value;
        const clientName = document.getElementById('callClientId').selectedOptions[0]?.text || 'Cliente';
        const duration = document.getElementById('callDuration').value;
        const result = document.getElementById('callResult').value;
        const notes = document.getElementById('callNotes').value;
        
        if (!clientId || !result) {
            showMessage('Por favor completa los campos requeridos', 'error');
            return;
        }
        
        const success = await callsTracking.registerCall({
            clientId,
            clientName,
            duration,
            result,
            notes
        });
        
        if (success) {
            showMessage('✅ Llamada registrada exitosamente', 'success');
            form.reset();
            loadCallsList();
            updateCallsStats();
            renderCallsCharts();
        } else {
            showMessage('❌ Error al registrar la llamada', 'error');
        }
    });
}

/**
 * Update stats display
 */
function updateCallsStats() {
    if (!callsTracking) return;
    
    const metrics = callsTracking.getMetrics();
    
    const todayCount = document.getElementById('callsTodayCount');
    const successRate = document.getElementById('callsSuccessRate');
    const avgDuration = document.getElementById('callsAvgDuration');
    const pending = document.getElementById('callsPending');
    
    if (todayCount) todayCount.textContent = metrics.todayTotal;
    if (successRate) successRate.textContent = metrics.successRate + '%';
    if (avgDuration) avgDuration.textContent = metrics.avgDuration + 'm';
    if (pending) pending.textContent = metrics.pendingCount;
}

/**
 * Load and display calls list
 */
function loadCallsList() {
    if (!callsTracking) return;
    
    const calls = callsTracking.getAllCalls();
    const container = document.getElementById('callsList');
    
    if (!container) return;
    
    if (calls.length === 0) {
        container.innerHTML = '<p class="empty-message">No hay llamadas registradas aún.</p>';
        return;
    }
    
    const html = calls.slice(0, 20).map(call => {
        const date = new Date(call.timestamp?.toDate?.() || call.timestamp).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const resultEmoji = {
            'EXITOSO': '✅',
            'PENDIENTE': '⏳',
            'RECHAZADO': '❌'
        }[call.result] || '❓';
        
        return `
            <div class="call-item ${call.result.toLowerCase()}">
                <div class="call-header">
                    <h4>${resultEmoji} ${call.clientName}</h4>
                    <span class="call-badge ${call.result.toLowerCase()}">${call.result}</span>
                </div>
                <div class="call-details">
                    ⏱️ ${call.duration} minutos • ${date}
                </div>
                ${call.notes ? `<div class="call-notes">📝 ${call.notes}</div>` : ''}
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

/**
 * Render all calls charts
 */
function renderCallsCharts() {
    if (!callsTracking || !window.Chart) return;
    
    const chartsData = callsTracking.getCallsForCharts();
    
    // Chart 1: Calls by day
    const ctxDay = document.getElementById('callsDayChart');
    if (ctxDay && chartsData.byDay) {
        if (callsCharts.byDay) callsCharts.byDay.destroy();
        callsCharts.byDay = new Chart(ctxDay, {
            type: 'line',
            data: {
                labels: chartsData.byDay.labels,
                datasets: [{
                    label: 'Llamadas',
                    data: chartsData.byDay.data,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0,123,255,0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#007bff',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                animation: {duration: 1200, easing: 'easeOutQuart'},
                plugins: {legend: {display: true}},
                scales: {y: {beginAtZero: true}}
            }
        });
    }
    
    // Chart 2: Results distribution
    const ctxResult = document.getElementById('callsResultChart');
    if (ctxResult && chartsData.byResult) {
        if (callsCharts.byResult) callsCharts.byResult.destroy();
        callsCharts.byResult = new Chart(ctxResult, {
            type: 'doughnut',
            data: {
                labels: chartsData.byResult.labels,
                datasets: [{
                    data: chartsData.byResult.data,
                    backgroundColor: ['#34C759', '#FF9500', '#FF3B30'],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                animation: {duration: 1200, easing: 'easeOutBounce'},
                plugins: {legend: {position: 'bottom'}}
            }
        });
    }
    
    // Chart 3: Duration by client
    const ctxDuration = document.getElementById('callsDurationChart');
    if (ctxDuration && chartsData.byDuration) {
        if (callsCharts.byDuration) callsCharts.byDuration.destroy();
        callsCharts.byDuration = new Chart(ctxDuration, {
            type: 'bar',
            data: {
                labels: chartsData.byDuration.labels,
                datasets: [{
                    label: 'Minutos',
                    data: chartsData.byDuration.data,
                    backgroundColor: '#28a745',
                    borderColor: '#218838',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                animation: {duration: 1200, easing: 'easeOutElastic'},
                plugins: {legend: {display: false}},
                scales: {y: {beginAtZero: true}}
            }
        });
    }
    
    // Chart 4: Cumulative volume
    const ctxCumulative = document.getElementById('callsCumulativeChart');
    if (ctxCumulative && chartsData.cumulative) {
        if (callsCharts.cumulative) callsCharts.cumulative.destroy();
        callsCharts.cumulative = new Chart(ctxCumulative, {
            type: 'line',
            data: {
                labels: chartsData.cumulative.labels,
                datasets: [{
                    label: 'Volumen Acumulado',
                    data: chartsData.cumulative.data,
                    borderColor: '#9C27B0',
                    backgroundColor: 'rgba(156,39,176,0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#9C27B0'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                animation: {duration: 1200},
                plugins: {legend: {display: true}},
                scales: {y: {beginAtZero: true}}
            }
        });
    }
}

/**
 * Setup chart expansion for calls charts
 */
function setupCallsChartExpansion() {
    document.querySelectorAll('#card-calls-day, #card-calls-result, #card-calls-duration, #card-calls-cumulative').forEach(card => {
        card.style.cursor = 'pointer';
        card.onclick = function(e) {
            if (!card.classList.contains('expanded') && !card.querySelector('.close-expand')) {
                expandChartCard(card);
            }
        };
    });
}

/**
 * Populate clients select dropdown
 */
function populateClientsSelect() {
    const select = document.getElementById('callClientId');
    if (!select || !window.allClients) return;
    
    const optionsHtml = window.allClients.map(client => 
        `<option value="${client.id}">${client.name || 'Cliente'}</option>`
    ).join('');
    
    select.innerHTML = '<option value="">Seleccione cliente...</option>' + optionsHtml;
}
