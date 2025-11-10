/**
 * Sistema de Tracking de Ventas/Planes
 * Registra cada venta nueva o actualización de plan
 */

import { auth, db } from './firebase-config.js';
import { 
    collection, 
    addDoc,
    query,
    where,
    getDocs,
    orderBy,
    serverTimestamp,
    Timestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

let currentUser = null;

auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
    }
});

/**
 * Registrar una venta nueva cuando se crea un cliente
 */
window.registerNewClientSale = async function(clientData, clientId) {
    if (!currentUser) return false;

    try {
        const ventasRef = collection(db, 'ventas');
        
        await addDoc(ventasRef, {
            clientId: clientId,
            clientName: clientData.nombre,
            executiveId: currentUser.uid,
            executiveName: currentUser.displayName || currentUser.email,
            segmento: clientData.segmento,
            tipoPlan: clientData.tipoPlan,
            estadoPlan: clientData.estadoPlan,
            tipoVenta: 'nuevo_cliente',  // nuevo_cliente, upgrade, downgrade, renovacion
            monto: clientData.monto || 0,
            fechaVenta: Timestamp.now(),
            createdAt: Timestamp.now()
        });

        console.log('✅ Venta registrada:', {
            cliente: clientData.nombre,
            segmento: clientData.segmento,
            plan: clientData.tipoPlan
        });

        return true;
    } catch (error) {
        console.error('Error registrando venta:', error);
        return false;
    }
};

/**
 * Registrar actualización de plan (upgrade/downgrade)
 */
window.registerPlanUpdate = async function(clientData, planAnterior, clientId) {
    if (!currentUser) return false;

    try {
        // Determinar tipo de cambio
        const planesValor = { 'BASICO': 1, 'ESTÁNDAR': 2, 'PREMIUM': 3, 'PRO': 4 };
        const valorAnterior = planesValor[planAnterior?.toUpperCase()] || 0;
        const valorNuevo = planesValor[clientData.tipoPlan?.toUpperCase()] || 0;
        
        let tipoVenta = 'renovacion';
        if (valorNuevo > valorAnterior) tipoVenta = 'upgrade';
        if (valorNuevo < valorAnterior) tipoVenta = 'downgrade';

        const ventasRef = collection(db, 'ventas');
        
        await addDoc(ventasRef, {
            clientId: clientId,
            clientName: clientData.nombre,
            executiveId: currentUser.uid,
            executiveName: currentUser.displayName || currentUser.email,
            segmento: clientData.segmento,
            planAnterior: planAnterior,
            planNuevo: clientData.tipoPlan,
            estadoPlan: clientData.estadoPlan,
            tipoVenta: tipoVenta,  // upgrade, downgrade, renovacion
            monto: clientData.monto || 0,
            fechaVenta: Timestamp.now(),
            createdAt: Timestamp.now()
        });

        console.log('✅ Actualización registrada:', {
            cliente: clientData.nombre,
            de: planAnterior,
            a: clientData.tipoPlan,
            tipo: tipoVenta
        });

        return true;
    } catch (error) {
        console.error('Error registrando actualización:', error);
        return false;
    }
};

/**
 * Obtener metas basadas en VENTAS (no solo clientes)
 */
window.loadSalesMetas = async function() {
    if (!currentUser) return;

    try {
        const container = document.getElementById('metasContainer');
        if (!container) return;

        container.innerHTML = '<p class="loading">Cargando metas...</p>';

        const segments = ['PLATINO', 'ORO', 'PLATA', 'BRONCE'];
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        // Obtener metas guardadas
        const metasSnapshot = await getDocs(
            query(
                collection(db, 'metas'),
                where('executiveId', '==', currentUser.uid)
            )
        );

        const metasMap = {};
        metasSnapshot.forEach(doc => {
            metasMap[doc.data().segment] = doc.data();
        });

        container.innerHTML = '';

        for (const segment of segments) {
            const objetivo = metasMap[segment]?.objetivo || 10;

            // Contar VENTAS en este mes para este segmento
            const ventasSnapshot = await getDocs(
                query(
                    collection(db, 'ventas'),
                    where('executiveId', '==', currentUser.uid),
                    where('segmento', '==', segment)
                )
            );

            let ventasEsteMes = 0;
            ventasSnapshot.forEach(doc => {
                const venta = doc.data();
                const ventaDate = venta.fechaVenta?.toDate ? venta.fechaVenta.toDate() : new Date(venta.fechaVenta);
                
                if (ventaDate.getMonth() === currentMonth && ventaDate.getFullYear() === currentYear) {
                    ventasEsteMes++;
                }
            });

            const alcanzado = ventasEsteMes;
            const porcentaje = Math.min((alcanzado / objetivo) * 100, 100);
            const porcentajeMostrar = Math.round(porcentaje);

            const metaCard = document.createElement('div');
            metaCard.className = `meta-card ${porcentajeMostrar >= 100 ? 'meta-completed' : ''}`;
            metaCard.innerHTML = `
                <div class="meta-header">
                    <h3>${getSegmentoBadge(segment)} ${segment}</h3>
                    <span class="meta-percentage ${porcentajeMostrar >= 100 ? 'completed' : ''}">${porcentajeMostrar}%</span>
                </div>
                <div class="meta-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(porcentaje, 100)}%"></div>
                    </div>
                </div>
                <div class="meta-stats">
                    <span>Ventas: <strong>${alcanzado}</strong></span>
                    <span>Objetivo: <strong>${objetivo}</strong></span>
                </div>
                <div class="meta-details">
                    <small>Meta de este mes (${today.toLocaleDateString('es-CR', { month: 'long' })})</small>
                </div>
                <div class="meta-input-group">
                    <input type="number" class="meta-input" placeholder="Nueva meta" min="1" value="${objetivo}">
                    <button class="btn btn-small btn-primary" onclick="updateMetaFromSales('${segment}', this)">
                        💾 Guardar
                    </button>
                </div>
            `;
            container.appendChild(metaCard);
        }
    } catch (error) {
        console.error('Error cargando metas de ventas:', error);
    }
};

/**
 * Actualizar meta desde ventas
 */
window.updateMetaFromSales = async function(segment, button) {
    if (!currentUser) return;

    const input = button.previousElementSibling;
    const objetivo = parseInt(input.value);

    if (!objetivo || objetivo < 1) {
        alert('Ingresa un objetivo válido');
        return;
    }

    try {
        const metaRef = collection(db, 'metas');
        await addDoc(metaRef, {
            executiveId: currentUser.uid,
            segment,
            objetivo,
            updatedAt: Timestamp.now()
        });

        button.textContent = '✅ Guardado';
        setTimeout(() => {
            button.textContent = '💾 Guardar';
            loadSalesMetas();
        }, 1500);
    } catch (error) {
        console.error('Error actualizando meta:', error);
        alert('Error guardando meta');
    }
};

/**
 * Ver reporte de ventas
 */
window.loadSalesReport = async function() {
    if (!currentUser) return;

    try {
        const container = document.getElementById('salesReportContainer');
        if (!container) return;

        container.innerHTML = '<p class="loading">Cargando reporte...</p>';

        const ventasSnapshot = await getDocs(
            query(
                collection(db, 'ventas'),
                where('executiveId', '==', currentUser.uid),
                orderBy('fechaVenta', 'desc')
            )
        );

        if (ventasSnapshot.empty) {
            container.innerHTML = '<p class="empty-message">No hay ventas registradas</p>';
            return;
        }

        const ventas = [];
        ventasSnapshot.forEach(doc => {
            ventas.push(doc.data());
        });

        const table = document.createElement('table');
        table.className = 'sales-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Cliente</th>
                    <th>Segmento</th>
                    <th>Plan</th>
                    <th>Tipo</th>
                    <th>Fecha</th>
                </tr>
            </thead>
            <tbody>
                ${ventas.map(v => `
                    <tr>
                        <td><strong>${v.clientName}</strong></td>
                        <td><span class="badge badge-${v.segmento?.toLowerCase()}">${v.segmento}</span></td>
                        <td>${v.tipoPlan || '-'}</td>
                        <td>
                            <span class="badge badge-${getTipoVentaBadge(v.tipoVenta)}">
                                ${v.tipoVenta === 'nuevo_cliente' ? '✨ Nuevo' : 
                                  v.tipoVenta === 'upgrade' ? '⬆️ Upgrade' :
                                  v.tipoVenta === 'downgrade' ? '⬇️ Downgrade' : '🔄 Renovación'}
                            </span>
                        </td>
                        <td>${new Date(v.fechaVenta?.toDate ? v.fechaVenta.toDate() : v.fechaVenta).toLocaleDateString('es-CR')}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        container.appendChild(table);
    } catch (error) {
        console.error('Error cargando reporte:', error);
        container.innerHTML = '<p class="error-message">Error cargando reporte</p>';
    }
};

/**
 * Obtener badge para tipo de venta
 */
function getTipoVentaBadge(tipo) {
    const badges = {
        'nuevo_cliente': 'success',
        'upgrade': 'warning',
        'downgrade': 'accent',
        'renovacion': 'primary'
    };
    return badges[tipo] || 'secondary';
}

/**
 * Badge de segmento
 */
function getSegmentoBadge(segment) {
    const badges = {
        'PLATINO': '💎',
        'ORO': '🥇',
        'PLATA': '🥈',
        'BRONCE': '🥉'
    };
    return badges[segment] || '📌';
}

console.log('✅ Sistema de Ventas/Metas cargado');
