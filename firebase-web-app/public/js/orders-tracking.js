/**
 * Orders Tracking Module
 * Executive Performance - CRM
 * Handles order registration, 24h reminders, and status management
 */

class OrdersTracking {
    constructor() {
        this.orders = [];
        this.metrics = {
            pendingCount: 0,
            sentCount: 0,
            totalCount: 0
        };
        this.userId = null;
        this.reminderCheckInterval = null;
    }

    /**
     * Initialize with current user
     */
    async init(userId) {
        this.userId = userId;
        console.log('🔧 OrdersTracking inicializando para:', userId);
        await this.loadOrders();
        this.calculateMetrics();
        this.startReminderCheck();
    }

    /**
     * Load orders from Firestore
     */
    async loadOrders() {
        if (!this.userId) {
            console.log('⚠️ No userId disponible');
            return;
        }
        
        try {
            const db = firebase.firestore();
            const snapshot = await db.collection('orders')
                .where('userId', '==', this.userId)
                .orderBy('createdAt', 'desc')
                .limit(1000)
                .get();
            
            this.orders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            console.log('✅ Pedidos cargados:', this.orders.length);
            this.calculateMetrics();
        } catch (error) {
            console.error('❌ Error cargando pedidos:', error.message);
        }
    }

    /**
     * Register a new order
     */
    async registerOrder(orderData) {
        if (!this.userId) {
            console.log('❌ No userId disponible');
            return {success: false};
        }
        
        try {
            const db = firebase.firestore();
            const newOrder = {
                userId: this.userId,
                orderNumber: orderData.orderNumber,
                imei: orderData.imei,
                type: orderData.type, // KOMERCIAL or SIEBEL
                client: orderData.client || '',
                status: 'PENDIENTE', // PENDIENTE or ENVIADO
                timestamp: new Date(),
                date: new Date().toISOString().split('T')[0],
                createdAt: new Date().getTime(),
                lastReminderAt: new Date().getTime(),
                reminderCount: 0
            };
            
            const docRef = await db.collection('orders').add(newOrder);
            this.orders.unshift({id: docRef.id, ...newOrder});
            this.calculateMetrics();
            
            console.log('✅ Pedido registrado:', docRef.id);
            return {success: true, id: docRef.id};
        } catch (error) {
            console.error('❌ Error registrando pedido:', error.message);
            return {success: false};
        }
    }

    /**
     * Mark order as sent
     */
    async markOrderAsSent(orderId) {
        if (!this.userId) return false;
        
        try {
            const db = firebase.firestore();
            await db.collection('orders').doc(orderId).update({
                status: 'ENVIADO',
                sentAt: new Date(),
                sentAtTime: new Date().getTime()
            });
            
            const order = this.orders.find(o => o.id === orderId);
            if (order) {
                order.status = 'ENVIADO';
                order.sentAt = new Date();
                order.sentAtTime = new Date().getTime();
            }
            
            this.calculateMetrics();
            console.log('✅ Pedido marcado como enviado:', orderId);
            return true;
        } catch (error) {
            console.error('❌ Error actualizando pedido:', error.message);
            return false;
        }
    }

    /**
     * Calculate metrics automatically
     */
    calculateMetrics() {
        const pending = this.orders.filter(o => o.status === 'PENDIENTE').length;
        const sent = this.orders.filter(o => o.status === 'ENVIADO').length;
        
        this.metrics = {
            pendingCount: pending,
            sentCount: sent,
            totalCount: this.orders.length
        };
        
        return this.metrics;
    }

    /**
     * Get orders for charts
     */
    getOrdersForCharts() {
        return {
            byStatus: this.getOrdersByStatus(),
            byDay: this.getOrdersByDay()
        };
    }

    /**
     * Orders by status
     */
    getOrdersByStatus() {
        const pending = this.orders.filter(o => o.status === 'PENDIENTE').length;
        const sent = this.orders.filter(o => o.status === 'ENVIADO').length;
        
        return {
            labels: ['Pendientes', 'Enviados'],
            data: [pending, sent]
        };
    }

    /**
     * Orders per day (last 7 days)
     */
    getOrdersByDay() {
        const days = {};
        const labels = [];
        const data = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayName = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'][date.getDay()];
            
            days[dateStr] = 0;
            labels.push(dayName);
        }
        
        this.orders.forEach(order => {
            if (days.hasOwnProperty(order.date)) {
                days[order.date]++;
            }
        });
        
        labels.forEach(label => {
            const dateStr = Object.keys(days).find(date => {
                const d = new Date(date);
                return ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'][d.getDay()] === label;
            });
            data.push(days[dateStr] || 0);
        });
        
        return {labels, data};
    }

    /**
     * Get pending reminders (24h+)
     */
    getPendingReminders() {
        const now = new Date().getTime();
        const hours24 = 24 * 60 * 60 * 1000;
        
        return this.orders.filter(order => {
            if (order.status !== 'PENDIENTE') return false;
            const timeSinceCreation = now - order.createdAt;
            const timeSinceLastReminder = now - order.lastReminderAt;
            
            return timeSinceCreation >= hours24 && timeSinceLastReminder >= hours24;
        });
    }

    /**
     * Start checking for reminders every hour
     */
    startReminderCheck() {
        this.reminderCheckInterval = setInterval(async () => {
            const reminders = this.getPendingReminders();
            
            if (reminders.length > 0) {
                this.showReminders(reminders);
                
                // Update last reminder time
                const db = firebase.firestore();
                for (const order of reminders) {
                    await db.collection('orders').doc(order.id).update({
                        lastReminderAt: new Date().getTime(),
                        reminderCount: (order.reminderCount || 0) + 1
                    });
                    
                    const idx = this.orders.findIndex(o => o.id === order.id);
                    if (idx >= 0) {
                        this.orders[idx].lastReminderAt = new Date().getTime();
                        this.orders[idx].reminderCount = (order.reminderCount || 0) + 1;
                    }
                }
            }
        }, 60 * 60 * 1000); // Check every hour
    }

    /**
     * Show reminder notifications
     */
    showReminders(reminders) {
        const message = `🔔 Tienes ${reminders.length} pedido(s) pendiente(s) por más de 24 horas:\n\n${
            reminders.map(r => `${r.type}: ${r.orderNumber} (IMEI: ${r.imei})`).join('\n')
        }\n\n¿Ya fue enviado a nivel de sistema?`;
        
        if (typeof showMessage === 'function') {
            reminders.forEach(reminder => {
                showMessage(`🔔 Recordatorio: Pedido ${reminder.orderNumber} pendiente por más de 24h`, 'warning');
            });
        }
    }

    /**
     * Get all orders
     */
    getAllOrders() {
        return this.orders;
    }

    /**
     * Get metrics
     */
    getMetrics() {
        return this.metrics;
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.reminderCheckInterval) {
            clearInterval(this.reminderCheckInterval);
        }
    }
}

// Export globally
window.OrdersTracking = OrdersTracking;

console.log('✅ orders-tracking.js cargado');
