document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
});

let occupancyChart = null;
let growthChart = null;

function initializeDashboard() {
    const period = document.getElementById('periodSelect').value;
    loadDashboardStats(period);
    loadTablesOccupancy();
    loadGrowthTrends();
    loadMaintenanceSchedule();
}

function setupEventListeners() {
    document.getElementById('periodSelect').addEventListener('change', function() {
        loadDashboardStats(this.value);
    });
}

async function loadDashboardStats(period) {
    try {
        const response = await fetch(`/api/stats/dashboard?period=${period}`);
        const data = await response.json();

        if (data.success) {
            updateOverviewStats(data.data);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
        showError('Erreur lors du chargement des statistiques');
    }
}

async function loadTablesOccupancy() {
    try {
        const response = await fetch('/api/stats/tables/occupancy');
        const data = await response.json();

        if (data.success) {
            renderOccupancyChart(data.data);
        }
    } catch (error) {
        console.error('Erreur lors du chargement de l\'occupation:', error);
        showError('Erreur lors du chargement de l\'occupation des tables');
    }
}

async function loadGrowthTrends() {
    try {
        const response = await fetch('/api/stats/growth/trends');
        const data = await response.json();

        if (data.success) {
            renderGrowthChart(data.data);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des tendances:', error);
        showError('Erreur lors du chargement des tendances de croissance');
    }
}

async function loadMaintenanceSchedule() {
    try {
        const response = await fetch('/api/stats/maintenance/schedule');
        const data = await response.json();

        if (data.success) {
            renderMaintenanceSchedule(data.data);
        }
    } catch (error) {
        console.error('Erreur lors du chargement du planning:', error);
        showError('Erreur lors du chargement du planning de maintenance');
    }
}

function updateOverviewStats(stats) {
    document.getElementById('totalTables').textContent = stats.tables.total;
    document.getElementById('activePools').textContent = stats.pools.available;
    document.getElementById('pendingOrders').textContent = stats.orders.pending;
}

function renderOccupancyChart(data) {
    const ctx = document.getElementById('occupancyChart').getContext('2d');
    
    if (occupancyChart) {
        occupancyChart.destroy();
    }

    occupancyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.name),
            datasets: [{
                label: 'Occupation (%)',
                data: data.map(item => item.percentage),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function renderGrowthChart(data) {
    const ctx = document.getElementById('growthChart').getContext('2d');
    
    if (growthChart) {
        growthChart.destroy();
    }

    growthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => item.date),
            datasets: [{
                label: 'Croissance moyenne (mm)',
                data: data.map(item => item.growth),
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function renderMaintenanceSchedule(schedule) {
    const container = document.getElementById('maintenanceList');
    container.innerHTML = '';

    schedule.forEach(item => {
        const div = document.createElement('div');
        div.className = `maintenance-item status-${item.status}`;
        div.innerHTML = `
            <div class="item-header">
                <span class="item-name">${item.name}</span>
                <span class="item-type">${item.type === 'table' ? 'Table' : 'Bassin'}</span>
            </div>
            <div class="item-dates">
                <div>
                    <small>Dernière maintenance:</small>
                    <span>${formatDate(item.lastMaintenance)}</span>
                </div>
                <div>
                    <small>Prochaine maintenance:</small>
                    <span>${formatDate(item.nextMaintenance)}</span>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

function exportStats() {
    const modal = new bootstrap.Modal(document.getElementById('exportModal'));
    modal.show();
}

async function downloadExport() {
    const type = document.getElementById('exportType').value;
    const format = document.getElementById('exportFormat').value;
    const period = document.getElementById('periodSelect').value;

    try {
        const response = await fetch(`/api/stats/export/${type}?period=${period}&format=${format}`);
        const blob = await response.blob();
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `export_${type}_${formatDateForFilename(new Date())}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        const modal = bootstrap.Modal.getInstance(document.getElementById('exportModal'));
        modal.hide();
    } catch (error) {
        console.error('Erreur lors de l\'export:', error);
        showError('Erreur lors de l\'export des données');
    }
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('fr-FR');
}

function formatDateForFilename(date) {
    return date.toISOString().split('T')[0];
}

function showError(message) {
    // Utiliser le système de notification toast existant
    showNotification('error', message);
}
