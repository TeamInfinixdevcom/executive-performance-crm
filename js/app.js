// Main Application Module

// Tab navigation
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    setupNavigation();
    
    // Initialize modal
    setupModal();
    
    // Initialize mobile menu
    setupMobileMenu();
    
    // Initialize search
    setupSearch();
    
    // Initialize dashboard on load
    setTimeout(() => {
        if (currentUser) {
            initDashboard();
        }
    }, 1000);
});

// Setup navigation between tabs
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabName = item.getAttribute('data-tab');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(tab => tab.classList.remove('active'));
            const targetTab = document.getElementById(`${tabName}-tab`);
            if (targetTab) {
                targetTab.classList.add('active');
            }
            
            // Load data for specific tabs
            loadTabData(tabName);
        });
    });
}

// Load data based on active tab
function loadTabData(tabName) {
    switch (tabName) {
        case 'dashboard':
            initDashboard();
            break;
        case 'clients':
            loadClients();
            break;
        case 'sales':
            loadSales();
            break;
        case 'activities':
            loadActivities();
            break;
        case 'team':
            loadTeam();
            break;
        case 'settings':
            loadSettings();
            break;
        case 'profile':
            loadProfile();
            break;
    }
}

// Setup modal functionality
function setupModal() {
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}

// Close modal
function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Setup mobile menu
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (event) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
        
        // Close sidebar when clicking nav item on mobile
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                }
            });
        });
    }
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            performSearch(searchTerm);
        });
    }
}

// Perform search across active tab
function performSearch(searchTerm) {
    if (!searchTerm) {
        // Reset filters if search is empty
        return;
    }
    
    // Get active tab
    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) return;
    
    // Search in tables
    const tables = activeTab.querySelectorAll('.data-table tbody tr');
    tables.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    // Search in cards
    const cards = activeTab.querySelectorAll('.activity-card, .team-member-card');
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Notifications button handler
document.getElementById('notifications-btn')?.addEventListener('click', () => {
    showNotificationsPanel();
});

// Show notifications panel
function showNotificationsPanel() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <h2>Notificaciones</h2>
        <div id="notifications-list" style="max-height: 400px; overflow-y: auto;">
            <p style="text-align: center; color: var(--text-secondary);">Cargando notificaciones...</p>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Load recent activities as notifications
    loadNotifications();
}

// Load notifications
async function loadNotifications() {
    try {
        const notificationsList = document.getElementById('notifications-list');
        if (!notificationsList) return;
        
        const snapshot = await database.ref('activities').orderByChild('timestamp').limitToLast(20).once('value');
        const activities = [];
        
        snapshot.forEach((childSnapshot) => {
            activities.unshift({
                id: childSnapshot.key,
                ...childSnapshot.val()
            });
        });
        
        if (activities.length === 0) {
            notificationsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No hay notificaciones</p>';
            return;
        }
        
        notificationsList.innerHTML = '';
        
        activities.forEach(activity => {
            const notifItem = document.createElement('div');
            notifItem.className = 'activity-item';
            notifItem.style.cursor = 'pointer';
            
            const iconClass = getActivityIcon(activity.type);
            const timeAgo = getTimeAgo(activity.timestamp);
            
            notifItem.innerHTML = `
                <div class="activity-icon">
                    <i class="${iconClass}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title || 'Notificación'}</h4>
                    <p>${activity.description || ''} • ${timeAgo}</p>
                </div>
            `;
            
            notificationsList.appendChild(notifItem);
        });
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

// Update page title based on active tab
function updatePageTitle(tabName) {
    const titles = {
        'dashboard': 'Dashboard',
        'clients': 'Clientes',
        'sales': 'Ventas',
        'activities': 'Actividades',
        'reports': 'Reportes',
        'team': 'Equipo',
        'settings': 'Configuración',
        'profile': 'Perfil'
    };
    
    document.title = `${titles[tabName] || 'CRM'} - Executive Performance CRM`;
}

// Export utility functions
window.closeModal = closeModal;
window.getTimeAgo = getTimeAgo;
window.getActivityIcon = getActivityIcon;
