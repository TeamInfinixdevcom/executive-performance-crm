// Reports Module
let reportChart = null;

// Generate report button handler
document.getElementById('generate-report-btn')?.addEventListener('click', () => {
    generateReport();
});

// Generate report based on filters
async function generateReport() {
    const reportType = document.getElementById('report-type').value;
    const startDate = document.getElementById('report-start-date').value;
    const endDate = document.getElementById('report-end-date').value;
    
    if (!startDate || !endDate) {
        showNotification('Por favor seleccione las fechas', 'error');
        return;
    }
    
    try {
        switch (reportType) {
            case 'sales':
                await generateSalesReport(startDate, endDate);
                break;
            case 'clients':
                await generateClientsReport(startDate, endDate);
                break;
            case 'performance':
                await generatePerformanceReport(startDate, endDate);
                break;
        }
        
        showNotification('Reporte generado exitosamente', 'success');
    } catch (error) {
        console.error('Error generating report:', error);
        showNotification('Error al generar reporte', 'error');
    }
}

// Generate sales report
async function generateSalesReport(startDate, endDate) {
    const snapshot = await database.ref('sales').once('value');
    const sales = snapshot.val() || {};
    
    // Filter sales by date range
    const filteredSales = Object.values(sales).filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
    });
    
    // Group by month
    const salesByMonth = {};
    filteredSales.forEach(sale => {
        const month = new Date(sale.date).toLocaleDateString('es', { month: 'short', year: 'numeric' });
        salesByMonth[month] = (salesByMonth[month] || 0) + parseFloat(sale.amount || 0);
    });
    
    // Prepare chart data
    const labels = Object.keys(salesByMonth);
    const data = Object.values(salesByMonth);
    
    // Update chart
    updateReportChart(labels, data, 'Ventas por Mes');
}

// Generate clients report
async function generateClientsReport(startDate, endDate) {
    const snapshot = await database.ref('clients').once('value');
    const clients = snapshot.val() || {};
    
    // Filter clients by creation date
    const filteredClients = Object.values(clients).filter(client => {
        const createdDate = new Date(client.createdAt);
        return createdDate >= new Date(startDate) && createdDate <= new Date(endDate);
    });
    
    // Group by month
    const clientsByMonth = {};
    filteredClients.forEach(client => {
        const month = new Date(client.createdAt).toLocaleDateString('es', { month: 'short', year: 'numeric' });
        clientsByMonth[month] = (clientsByMonth[month] || 0) + 1;
    });
    
    // Prepare chart data
    const labels = Object.keys(clientsByMonth);
    const data = Object.values(clientsByMonth);
    
    // Update chart
    updateReportChart(labels, data, 'Clientes Nuevos por Mes');
}

// Generate performance report
async function generatePerformanceReport(startDate, endDate) {
    const salesSnapshot = await database.ref('sales').once('value');
    const sales = salesSnapshot.val() || {};
    
    const activitiesSnapshot = await database.ref('activities').once('value');
    const activities = activitiesSnapshot.val() || {};
    
    // Filter by date range
    const filteredSales = Object.values(sales).filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
    });
    
    const filteredActivities = Object.values(activities).filter(activity => {
        const activityDate = new Date(activity.timestamp);
        return activityDate >= new Date(startDate) && activityDate <= new Date(endDate);
    });
    
    // Calculate metrics
    const totalSales = filteredSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
    const completedActivities = filteredActivities.filter(a => a.status === 'completed').length;
    const pendingActivities = filteredActivities.filter(a => a.status === 'pending').length;
    
    // Prepare chart data
    const labels = ['Ventas Totales', 'Actividades Completadas', 'Actividades Pendientes'];
    const data = [totalSales, completedActivities, pendingActivities];
    
    // Update chart
    updateReportChart(labels, data, 'Rendimiento General', 'bar');
}

// Update report chart
function updateReportChart(labels, data, title, type = 'bar') {
    const ctx = document.getElementById('report-chart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (reportChart) {
        reportChart.destroy();
    }
    
    reportChart = new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: data,
                backgroundColor: [
                    'rgba(37, 99, 235, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(139, 92, 246, 0.7)',
                    'rgba(239, 68, 68, 0.7)'
                ],
                borderColor: [
                    'rgba(37, 99, 235, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: title
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

// Initialize reports tab
document.addEventListener('DOMContentLoaded', () => {
    const reportsNav = document.querySelector('[data-tab="reports"]');
    if (reportsNav) {
        reportsNav.addEventListener('click', () => {
            // Set default dates (last 6 months)
            const endDate = new Date();
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 6);
            
            document.getElementById('report-start-date').value = startDate.toISOString().split('T')[0];
            document.getElementById('report-end-date').value = endDate.toISOString().split('T')[0];
        });
    }
});
