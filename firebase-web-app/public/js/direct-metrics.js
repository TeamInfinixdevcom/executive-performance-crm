/**
 * SOLUCIÓN TEMPORAL PARA MÉTRICAS
 * 
 * Este archivo carga métricas directamente desde Firestore
 * sin depender de Cloud Functions rotas
 */

import { auth, db } from './firebase-config.js';
import { collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Función para cargar métricas directamente
const getMetricsDirectly = async () => {
    try {
        // Verificar que el usuario esté autenticado
        const user = auth.currentUser;
        if (!user) {
            console.error('❌ Usuario no autenticado');
            return;
        }

        console.log('🔍 Cargando métricas directamente para:', user.email, 'UID:', user.uid);

        // Obtener clientes del usuario actual usando sintaxis Firestore v9
        const clientsQuery = query(
            collection(db, 'clients'),
            where('executiveId', '==', user.uid)
        );

        const clientsSnapshot = await getDocs(clientsQuery);
        
        const metrics = {
            total: 0,
            platino: 0,
            oro: 0,
            plata: 0,
            bronce: 0,
            black: 0
        };

        clientsSnapshot.forEach(doc => {
            const client = doc.data();
            const segmento = (client.segmento || '').toUpperCase();
            
            metrics.total++;
            
            switch(segmento) {
                case 'PLATINO':
                    metrics.platino++;
                    break;
                case 'ORO':
                    metrics.oro++;
                    break;
                case 'PLATA':
                    metrics.plata++;
                    break;
                case 'BRONCE':
                    metrics.bronce++;
                    break;
                case 'BLACK':
                    metrics.black++;
                    break;
            }
        });

        console.log('📊 Métricas calculadas:', metrics);

        // Actualizar la interfaz
        updateMetricsDisplay(metrics);
        
        return metrics;

    } catch (error) {
        console.error('Error cargando métricas:', error);
        return null;
    }
};

// Función para actualizar la visualización de métricas
const updateMetricsDisplay = (metrics) => {
    try {
        // Actualizar tarjetas de métricas
        const updateCard = (id, value) => {
            const element = document.querySelector(`[data-metric="${id}"], #${id}Metric, .metric-${id}`);
            if (element) {
                const valueElement = element.querySelector('.stat-value, .metric-value, .number') || element;
                if (valueElement) {
                    valueElement.textContent = value;
                }
            }
        };

        updateCard('total', metrics.total);
        updateCard('platino', metrics.platino);
        updateCard('oro', metrics.oro);
        updateCard('plata', metrics.plata);
        updateCard('bronce', metrics.bronce);
        updateCard('black', metrics.black);

        // Actualizar elementos específicos del dashboard
        const elementsToUpdate = [
            { selector: '#metricsTotal', value: metrics.total },
            { selector: '#metricsPlatino', value: metrics.platino },
            { selector: '#metricsOro', value: metrics.oro },
            { selector: '#metricsPlata', value: metrics.plata },
            { selector: '#metricsBronce', value: metrics.bronce },
            { selector: '#metricsBlack', value: metrics.black }
        ];

        elementsToUpdate.forEach(item => {
            const element = document.querySelector(item.selector);
            if (element) {
                element.textContent = item.value;
            }
        });

        // Actualizar dashboard interno si existe
        if (window.updateDashboardMetrics) {
            window.updateDashboardMetrics(metrics);
        }

        // Los gráficos se manejan por displayMetrics() en index.html
        // No crear gráficos adicionales aquí para evitar conflictos

        console.log('✅ Métricas actualizadas en la interfaz');

    } catch (error) {
        console.error('Error actualizando interfaz de métricas:', error);
    }
};

// Función para crear gráficos directamente
const createDirectCharts = (metrics) => {
    try {
        // Gráfico de dona
        const doughnutCanvas = document.getElementById('segmentChart');
        if (doughnutCanvas) {
            const ctx = doughnutCanvas.getContext('2d');
            
            // Destruir gráfico existente si existe y tiene el método destroy
            if (window.segmentChart && typeof window.segmentChart.destroy === 'function') {
                window.segmentChart.destroy();
            }
            
            window.segmentChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['PLATINO', 'ORO', 'PLATA', 'BRONCE', 'BLACK'],
                    datasets: [{
                        data: [metrics.platino, metrics.oro, metrics.plata, metrics.bronce, metrics.black],
                        backgroundColor: [
                            '#FFD700', // Platino
                            '#FFA500', // Oro  
                            '#C0C0C0', // Plata
                            '#CD7F32', // Bronce
                            '#000000'  // Black
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Gráfico de tendencias (mockup)
        const trendCanvas = document.getElementById('trendChart');
        if (trendCanvas) {
            const ctx = trendCanvas.getContext('2d');
            
            if (window.trendChart) {
                window.trendChart.destroy();
            }
            
            window.trendChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Ventas',
                        data: [metrics.total * 0.6, metrics.total * 0.7, metrics.total * 0.8, metrics.total * 0.9, metrics.total, metrics.total * 1.1],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

    } catch (error) {
        console.error('Error creando gráficos:', error);
    }
};

// Función para ejecutar cuando la página esté lista
const initDirectMetrics = () => {
    console.log('🚀 Inicializando métricas directas...');
    
    // Esperar a que el usuario esté autenticado
    console.log('🔥 Firebase inicializado, esperando autenticación...');
    
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('👤 Usuario autenticado, cargando métricas en 2 segundos...');
            setTimeout(getMetricsDirectly, 2000);
        } else {
            console.log('❌ Usuario no autenticado');
        }
    });
};

// Exportar funciones globalmente para acceso desde otros scripts
window.getMetricsDirectly = getMetricsDirectly;
window.updateMetricsDisplay = updateMetricsDisplay;
window.initDirectMetrics = initDirectMetrics;

// También exportar para imports ES6
export { getMetricsDirectly, updateMetricsDisplay, initDirectMetrics };

// Auto-inicializar si el DOM está listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDirectMetrics);
} else {
    initDirectMetrics();
}

console.log('✅ Script de métricas directas cargado - VERSIÓN CORREGIDA v20251116003 - SIN ERRORES DE GRÁFICOS');