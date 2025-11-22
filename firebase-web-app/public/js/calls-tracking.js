/**
 * Calls Tracking Module
 * Executive Performance - CRM
 * Handles call registration, storage, and automatic metrics calculation
 */

class CallsTracking {
    constructor() {
        this.calls = [];
        this.metrics = {
            todayTotal: 0,
            successRate: 0,
            avgDuration: 0,
            pendingCount: 0,
            rejectedCount: 0
        };
        this.userId = null;
    }

    /**
     * Initialize with current user
     */
    async init(userId) {
        this.userId = userId;
        await this.loadCalls();
        this.calculateMetrics();
    }

    /**
     * Load calls from Firestore
     */
    async loadCalls() {
        if (!this.userId) return;
        
        try {
            const db = firebase.firestore();
            const snapshot = await db.collection('calls')
                .where('userId', '==', this.userId)
                .orderBy('timestamp', 'desc')
                .limit(1000)
                .get();
            
            this.calls = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            this.calculateMetrics();
        } catch (error) {
            console.error('Error loading calls:', error);
        }
    }

    /**
     * Register a new call
     */
    async registerCall(callData) {
        if (!this.userId) return false;
        
        try {
            const db = firebase.firestore();
            const newCall = {
                userId: this.userId,
                clientId: callData.clientId,
                clientName: callData.clientName,
                duration: parseInt(callData.duration) || 0,
                result: callData.result, // EXITOSO, PENDIENTE, RECHAZADO
                notes: callData.notes || '',
                timestamp: new Date(),
                date: new Date().toISOString().split('T')[0]
            };
            
            const docRef = await db.collection('calls').add(newCall);
            this.calls.unshift({id: docRef.id, ...newCall});
            this.calculateMetrics();
            
            return true;
        } catch (error) {
            console.error('Error registering call:', error);
            return false;
        }
    }

    /**
     * Calculate metrics automatically from calls data
     */
    calculateMetrics() {
        const today = new Date().toISOString().split('T')[0];
        const todaysCalls = this.calls.filter(c => c.date === today);
        
        const totalToday = todaysCalls.length;
        const successfulToday = todaysCalls.filter(c => c.result === 'EXITOSO').length;
        const pendingToday = todaysCalls.filter(c => c.result === 'PENDIENTE').length;
        const rejectedToday = todaysCalls.filter(c => c.result === 'RECHAZADO').length;
        
        const totalDuration = todaysCalls.reduce((sum, c) => sum + (c.duration || 0), 0);
        const avgDuration = totalToday > 0 ? Math.round(totalDuration / totalToday) : 0;
        
        this.metrics = {
            todayTotal: totalToday,
            successRate: totalToday > 0 ? Math.round((successfulToday / totalToday) * 100) : 0,
            avgDuration: avgDuration,
            pendingCount: pendingToday,
            rejectedCount: rejectedToday,
            successCount: successfulToday
        };
        
        return this.metrics;
    }

    /**
     * Get calls for charts data
     */
    getCallsForCharts() {
        return {
            byDay: this.getCallsByDay(),
            byResult: this.getCallsByResult(),
            byDuration: this.getAvgDurationByClient(),
            cumulative: this.getCumulativeVolume()
        };
    }

    /**
     * Calls per day (last 7 days)
     */
    getCallsByDay() {
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
        
        this.calls.forEach(call => {
            if (days.hasOwnProperty(call.date)) {
                days[call.date]++;
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
     * Results distribution
     */
    getCallsByResult() {
        const exitosas = this.calls.filter(c => c.result === 'EXITOSO').length;
        const pendientes = this.calls.filter(c => c.result === 'PENDIENTE').length;
        const rechazadas = this.calls.filter(c => c.result === 'RECHAZADO').length;
        
        return {
            labels: ['Exitosas', 'Pendientes', 'Rechazadas'],
            data: [exitosas, pendientes, rechazadas]
        };
    }

    /**
     * Average duration by top clients
     */
    getAvgDurationByClient() {
        const clientDurations = {};
        
        this.calls.forEach(call => {
            if (!clientDurations[call.clientName]) {
                clientDurations[call.clientName] = {total: 0, count: 0};
            }
            clientDurations[call.clientName].total += call.duration || 0;
            clientDurations[call.clientName].count++;
        });
        
        const sorted = Object.entries(clientDurations)
            .map(([name, data]) => ({
                name,
                avg: data.count > 0 ? Math.round(data.total / data.count) : 0
            }))
            .sort((a, b) => b.avg - a.avg)
            .slice(0, 5);
        
        return {
            labels: sorted.map(s => s.name),
            data: sorted.map(s => s.avg)
        };
    }

    /**
     * Cumulative call volume
     */
    getCumulativeVolume() {
        const days = {};
        const labels = [];
        let cumulative = 0;
        const data = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayName = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'][date.getDay()];
            days[dateStr] = 0;
            labels.push(dayName);
        }
        
        this.calls.forEach(call => {
            if (days.hasOwnProperty(call.date)) {
                days[call.date]++;
            }
        });
        
        labels.forEach(label => {
            const dateStr = Object.keys(days).find(date => {
                const d = new Date(date);
                return ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'][d.getDay()] === label;
            });
            cumulative += days[dateStr] || 0;
            data.push(cumulative);
        });
        
        return {labels, data};
    }

    /**
     * Get all calls
     */
    getAllCalls() {
        return this.calls;
    }

    /**
     * Get metrics
     */
    getMetrics() {
        return this.metrics;
    }
}

// Export globally
window.CallsTracking = CallsTracking;
