// Dashboard Module - Real-time data visualization
let salesChart = null;

// Initialize dashboard
function initDashboard() {
    loadDashboardStats();
    initSalesChart();
    loadRecentActivity();
    
    // Real-time updates
    setupRealtimeListeners();
}

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        // Get clients count
        const clientsSnapshot = await database.ref('clients').once('value');
        const clientsData = clientsSnapshot.val() || {};
        const clientsCount = Object.keys(clientsData).length;
        document.getElementById('total-clients').textContent = clientsCount;

        // Get sales data for current month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const salesSnapshot = await database.ref('sales').once('value');
        const salesData = salesSnapshot.val() || {};
        
        let monthlySales = 0;
        let activeDeals = 0;
        
        Object.values(salesData).forEach(sale => {
            const saleDate = new Date(sale.date);
            if (saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear) {
                monthlySales += parseFloat(sale.amount || 0);
            }
            if (sale.status === 'active' || sale.status === 'pending') {
                activeDeals++;
            }
        });
        
        document.getElementById('total-sales').textContent = `$${monthlySales.toLocaleString()}`;
        document.getElementById('active-deals').textContent = activeDeals;

        // Get pending tasks
        const activitiesSnapshot = await database.ref('activities').once('value');
        const activitiesData = activitiesSnapshot.val() || {};
        const pendingTasks = Object.values(activitiesData).filter(a => a.status === 'pending').length;
        document.getElementById('pending-tasks').textContent = pendingTasks;
        
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Initialize sales chart with Chart.js
function initSalesChart() {
    const ctx = document.getElementById('sales-chart');
    if (!ctx) return;

    // Sample data for last 6 months
    const months = [];
    const salesData = [];
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        months.push(date.toLocaleDateString('es', { month: 'short', year: 'numeric' }));
        salesData.push(Math.floor(Math.random() * 50000) + 10000);
    }

    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Ventas ($)',
                data: salesData,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                tension: 0.4,
                fill: true
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
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Load recent activity feed
async function loadRecentActivity() {
    try {
        const activityFeed = document.getElementById('activity-feed');
        if (!activityFeed) return;
        
        activityFeed.innerHTML = '';
        
        const snapshot = await database.ref('activities').orderByChild('timestamp').limitToLast(10).once('value');
        const activities = [];
        
        snapshot.forEach((childSnapshot) => {
            activities.unshift({
                id: childSnapshot.key,
                ...childSnapshot.val()
            });
        });
        
        if (activities.length === 0) {
            activityFeed.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">No hay actividades recientes</p>';
            return;
        }
        
        activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            
            const iconClass = getActivityIcon(activity.type);
            const timeAgo = getTimeAgo(activity.timestamp);
            
            activityItem.innerHTML = `
                <div class="activity-icon">
                    <i class="${iconClass}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title || 'Actividad'}</h4>
                    <p>${activity.description || ''} • ${timeAgo}</p>
                </div>
            `;
            
            activityFeed.appendChild(activityItem);
        });
    } catch (error) {
        console.error('Error loading recent activity:', error);
    }
}

// Get icon based on activity type
function getActivityIcon(type) {
    const icons = {
        'sale': 'fas fa-dollar-sign',
        'client': 'fas fa-user',
        'task': 'fas fa-check-circle',
        'meeting': 'fas fa-calendar',
        'call': 'fas fa-phone',
        'email': 'fas fa-envelope'
    };
    return icons[type] || 'fas fa-info-circle';
}

// Calculate time ago
function getTimeAgo(timestamp) {
    if (!timestamp) return 'Hace un momento';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays < 7) return `Hace ${diffDays} d`;
    return date.toLocaleDateString('es');
}

// Setup real-time listeners for live updates
function setupRealtimeListeners() {
    // Listen for new sales
    database.ref('sales').on('child_added', () => {
        loadDashboardStats();
    });
    
    // Listen for new clients
    database.ref('clients').on('child_added', () => {
        loadDashboardStats();
    });
    
    // Listen for new activities
    database.ref('activities').on('child_added', () => {
        loadRecentActivity();
        loadDashboardStats();
    });
}

// Initialize when tab is shown
document.addEventListener('DOMContentLoaded', () => {
    // Initialize dashboard when switching to it
    const dashboardNav = document.querySelector('[data-tab="dashboard"]');
    if (dashboardNav) {
        dashboardNav.addEventListener('click', () => {
            setTimeout(initDashboard, 100);
        });
    }
});
