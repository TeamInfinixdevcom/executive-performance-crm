/**
 * Orders Management Module
 * Handles UI, forms, and chart rendering for orders tracking
 */

let ordersTracking = null;
let ordersStatusChart = null;
let ordersDayChart = null;

/**
 * Initialize orders management
 */
async function initOrdersManagement(userId) {
    console.log('🚀 Inicializando gestión de pedidos para usuario:', userId);
    
    ordersTracking = new OrdersTracking();
    await ordersTracking.init(userId);
    
    setupOrdersFormListener();
    renderOrdersCharts();
    renderOrdersList();
    updateOrdersMetrics();
    
    console.log('✅ Gestión de pedidos inicializada');
}

/**
 * Setup form submission listener
 */
function setupOrdersFormListener() {
    const form = document.getElementById('ordersForm');
    if (!form) {
        console.log('⚠️ Formulario de pedidos no encontrado');
        return;
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const orderNumber = document.getElementById('orderNumber').value.trim();
        const orderIMEI = document.getElementById('orderIMEI').value.trim();
        const orderType = document.getElementById('orderType').value;
        const orderClient = document.getElementById('orderClient').value.trim();
        
        if (!orderNumber || !orderIMEI) {
            showMessage('Por favor completa Pedido e IMEI', 'error');
            return;
        }
        
        console.log('📝 Registrando pedido:', {orderNumber, orderIMEI, orderType});
        
        const result = await ordersTracking.registerOrder({
            orderNumber,
            imei: orderIMEI,
            type: orderType,
            client: orderClient
        });
        
        if (result.success) {
            showMessage('✅ Pedido registrado correctamente', 'success');
            form.reset();
            updateOrdersMetrics();
            renderOrdersList();
            renderOrdersCharts();
        } else {
            showMessage('Error al registrar pedido', 'error');
        }
    });
}

/**
 * Update metrics display
 */
function updateOrdersMetrics() {
    const metrics = ordersTracking.getMetrics();
    
    const pendingEl = document.getElementById('ordersPendingCount');
    const sentEl = document.getElementById('ordersSentCount');
    const totalEl = document.getElementById('ordersTotalCount');
    
    if (pendingEl) pendingEl.textContent = metrics.pendingCount;
    if (sentEl) sentEl.textContent = metrics.sentCount;
    if (totalEl) totalEl.textContent = metrics.totalCount;
    
    console.log('📊 Métricas actualizadas:', metrics);
}

/**
 * Render status and daily charts
 */
function renderOrdersCharts() {
    const chartsData = ordersTracking.getOrdersForCharts();
    
    // Status chart (Donut)
    renderOrdersStatusChart(chartsData.byStatus);
    
    // Daily chart (Line)
    renderOrdersDayChart(chartsData.byDay);
}

/**
 * Render status donut chart
 */
function renderOrdersStatusChart(data) {
    const canvas = document.getElementById('ordersStatusChart');
    if (!canvas) {
        console.log('⚠️ Canvas ordersStatusChart no encontrado');
        return;
    }
    
    // Destroy previous chart
    if (ordersStatusChart) {
        ordersStatusChart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    
    ordersStatusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.data,
                backgroundColor: ['#FF6B6B', '#4ECDC4'],
                borderColor: ['#FF5252', '#45B7B0'],
                borderWidth: 2,
                hoverBorderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {size: 11, weight: 'bold'},
                        color: '#666',
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + ' pedidos';
                        }
                    }
                }
            }
        }
    });
    
    console.log('📊 Gráfico de estado renderizado');
}

/**
 * Render daily line chart
 */
function renderOrdersDayChart(data) {
    const canvas = document.getElementById('ordersDayChart');
    if (!canvas) {
        console.log('⚠️ Canvas ordersDayChart no encontrado');
        return;
    }
    
    // Destroy previous chart
    if (ordersDayChart) {
        ordersDayChart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    
    ordersDayChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Pedidos por día',
                data: data.data,
                fill: true,
                borderColor: '#6366F1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#6366F1',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 7,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: {size: 11, weight: 'bold'},
                        color: '#666',
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#6366F1',
                    borderWidth: 1,
                    padding: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + ' pedidos';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: Math.max(...data.data) + 2,
                    ticks: {
                        stepSize: 1,
                        color: '#999',
                        font: {size: 10}
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.05)',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: '#999',
                        font: {size: 10}
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            }
        }
    });
    
    console.log('📊 Gráfico de días renderizado');
}

/**
 * Render orders list
 */
function renderOrdersList() {
    const listContainer = document.getElementById('ordersList');
    if (!listContainer) {
        console.log('⚠️ Container ordersList no encontrado');
        return;
    }
    
    const orders = ordersTracking.getAllOrders();
    
    if (orders.length === 0) {
        listContainer.innerHTML = '<p style="text-align:center; color:#999; padding:20px;">Sin pedidos registrados</p>';
        console.log('📋 Lista vacía');
        return;
    }
    
    listContainer.innerHTML = orders.map(order => {
        const createdDate = new Date(order.createdAt);
        const now = new Date().getTime();
        const hoursAgo = Math.round((now - order.createdAt) / (1000 * 60 * 60));
        
        const statusBg = order.status === 'PENDIENTE' ? '#FFE5E5' : '#E5F5F3';
        const statusColor = order.status === 'PENDIENTE' ? '#FF6B6B' : '#4ECDC4';
        const statusText = order.status === 'PENDIENTE' ? '⏳ Pendiente' : '✅ Enviado';
        
        return `
            <div class="order-item" style="
                background: white;
                border: 1px solid #E0E0E0;
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div style="flex: 1;">
                    <div style="font-weight: bold; color: #333; margin-bottom: 4px;">
                        ${order.orderNumber} <span style="color: #999; font-size: 11px;">(${order.type})</span>
                    </div>
                    <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
                        IMEI: <span style="font-family: monospace;">${order.imei}</span>
                    </div>
                    <div style="font-size: 11px; color: #999;">
                        ${createdDate.toLocaleString()} • hace ${hoursAgo}h
                    </div>
                </div>
                <div style="
                    background: ${statusBg};
                    color: ${statusColor};
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: bold;
                    margin-right: 10px;
                    white-space: nowrap;
                ">
                    ${statusText}
                </div>
                ${order.status === 'PENDIENTE' ? `
                    <button onclick="markOrderAsSent('${order.id}')" style="
                        background: #4ECDC4;
                        color: white;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: bold;
                        transition: all 0.2s;
                    " onmouseover="this.style.background='#45B7B0'" onmouseout="this.style.background='#4ECDC4'">
                        Marcar Enviado
                    </button>
                ` : ''}
            </div>
        `;
    }).join('');
    
    console.log('📋 Lista renderizada con', orders.length, 'pedidos');
}

/**
 * Mark order as sent
 */
async function markOrderAsSent(orderId) {
    const success = await ordersTracking.markOrderAsSent(orderId);
    if (success) {
        showMessage('✅ Pedido marcado como enviado', 'success');
        updateOrdersMetrics();
        renderOrdersList();
        renderOrdersCharts();
    }
}

/**
 * Real-time updates from Firestore
 */
function listenToOrdersUpdates() {
    if (!ordersTracking || !ordersTracking.userId) {
        console.log('⚠️ OrdersTracking no está inicializado');
        return;
    }
    
    const db = firebase.firestore();
    
    db.collection('orders')
        .where('userId', '==', ordersTracking.userId)
        .onSnapshot(snapshot => {
            ordersTracking.orders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            ordersTracking.calculateMetrics();
            updateOrdersMetrics();
            renderOrdersList();
            renderOrdersCharts();
            
            console.log('🔄 Actualización en tiempo real:', ordersTracking.orders.length, 'pedidos');
        });
}

// Export functions globally
window.initOrdersManagement = initOrdersManagement;
window.markOrderAsSent = markOrderAsSent;
window.listenToOrdersUpdates = listenToOrdersUpdates;

console.log('✅ orders-management.js cargado');
