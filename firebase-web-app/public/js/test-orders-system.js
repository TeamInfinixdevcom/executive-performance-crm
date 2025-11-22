/**
 * Test Orders Tracking System
 * Verifica que el sistema de seguimiento de pedidos funciona correctamente
 */

const testResults = [];

async function logTest(name, success, details = '') {
    const result = {name, success, details, timestamp: new Date().toLocaleString()};
    testResults.push(result);
    console.log(`${success ? '✅' : '❌'} ${name}${details ? ': ' + details : ''}`);
}

async function testOrdersTracking() {
    console.log('\n🧪 INICIANDO PRUEBAS DEL SISTEMA DE PEDIDOS\n');
    
    // Test 1: Verificar que la clase existe
    try {
        if (typeof OrdersTracking !== 'undefined') {
            await logTest('Clase OrdersTracking existe', true);
        } else {
            await logTest('Clase OrdersTracking existe', false, 'Clase no encontrada');
            return;
        }
    } catch (error) {
        await logTest('Clase OrdersTracking existe', false, error.message);
        return;
    }
    
    // Test 2: Verificar que initOrdersManagement existe
    try {
        if (typeof initOrdersManagement === 'function') {
            await logTest('Función initOrdersManagement existe', true);
        } else {
            await logTest('Función initOrdersManagement existe', false, 'Función no encontrada');
        }
    } catch (error) {
        await logTest('Función initOrdersManagement existe', false, error.message);
    }
    
    // Test 3: Verificar que listenToOrdersUpdates existe
    try {
        if (typeof listenToOrdersUpdates === 'function') {
            await logTest('Función listenToOrdersUpdates existe', true);
        } else {
            await logTest('Función listenToOrdersUpdates existe', false, 'Función no encontrada');
        }
    } catch (error) {
        await logTest('Función listenToOrdersUpdates existe', false, error.message);
    }
    
    // Test 4: Verificar elementos del DOM
    try {
        const elements = [
            'orderNumber',
            'orderIMEI',
            'orderType',
            'orderClient',
            'ordersPendingCount',
            'ordersSentCount',
            'ordersTotalCount',
            'ordersStatusChart',
            'ordersDayChart',
            'ordersList',
            'ordersForm'
        ];
        
        const missing = elements.filter(id => !document.getElementById(id));
        
        if (missing.length === 0) {
            await logTest('Elementos del DOM', true, `${elements.length} elementos encontrados`);
        } else {
            await logTest('Elementos del DOM', false, `Faltan: ${missing.join(', ')}`);
        }
    } catch (error) {
        await logTest('Elementos del DOM', false, error.message);
    }
    
    // Test 5: Verificar estilos CSS
    try {
        const stylesheet = Array.from(document.styleSheets).find(sheet => 
            sheet.href && sheet.href.includes('orders-styles.css')
        );
        
        if (stylesheet) {
            await logTest('Hoja de estilos orders-styles.css', true, 'CSS cargado');
        } else {
            await logTest('Hoja de estilos orders-styles.css', false, 'No se encontró');
        }
    } catch (error) {
        await logTest('Hoja de estilos orders-styles.css', false, error.message);
    }
    
    // Test 6: Verificar gráficos
    try {
        const statusCanvas = document.getElementById('ordersStatusChart');
        const dayCanvas = document.getElementById('ordersDayChart');
        
        if (statusCanvas && dayCanvas) {
            await logTest('Gráficos Canvas', true, 'Ambos gráficos presentes');
        } else {
            await logTest('Gráficos Canvas', false, 'Falta algún gráfico');
        }
    } catch (error) {
        await logTest('Gráficos Canvas', false, error.message);
    }
    
    // Test 7: Verificar formulario
    try {
        const form = document.getElementById('ordersForm');
        if (form) {
            const inputs = form.querySelectorAll('input, select');
            await logTest('Formulario de Pedidos', true, `${inputs.length} campos encontrados`);
        } else {
            await logTest('Formulario de Pedidos', false, 'Formulario no encontrado');
        }
    } catch (error) {
        await logTest('Formulario de Pedidos', false, error.message);
    }
    
    // Test 8: Verificar botones
    try {
        const buttons = document.querySelectorAll('#ordersForm button');
        if (buttons.length >= 2) {
            await logTest('Botones del Formulario', true, `${buttons.length} botones encontrados`);
        } else {
            await logTest('Botones del Formulario', false, `Solo ${buttons.length} botones encontrados`);
        }
    } catch (error) {
        await logTest('Botones del Formulario', false, error.message);
    }
    
    // Resumen
    console.log('\n📊 RESUMEN DE PRUEBAS:');
    const passed = testResults.filter(r => r.success).length;
    const failed = testResults.filter(r => !r.success).length;
    console.log(`✅ Pasadas: ${passed}/${testResults.length}`);
    console.log(`❌ Fallidas: ${failed}/${testResults.length}`);
    
    if (failed === 0) {
        console.log('\n🎉 ¡TODAS LAS PRUEBAS PASARON!');
    } else {
        console.log('\n⚠️  Hay pruebas fallidas que necesitan revisión');
    }
    
    return {passed, failed, total: testResults.length};
}

// Exportar función globalmente
window.testOrdersTracking = testOrdersTracking;

// Auto-ejecutar si está en modo debug
if (window.location.search.includes('test=orders')) {
    console.log('Modo de pruebas activado');
    testOrdersTracking();
}
