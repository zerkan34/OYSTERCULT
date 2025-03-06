document.addEventListener('DOMContentLoaded', function() {
    initializeTableEvents();
    initializeFormValidation();
});

function initializeTableEvents() {
    // Gestionnaire pour le bouton détails
    document.querySelectorAll('[data-action="view-details"]').forEach(button => {
        button.addEventListener('click', function() {
            const tableId = this.closest('.table-card').dataset.tableId;
            viewTableDetails(tableId);
        });
    });

    // Gestionnaire pour le bouton modifier
    document.querySelectorAll('[data-action="edit"]').forEach(button => {
        button.addEventListener('click', function() {
            const tableId = this.closest('.table-card').dataset.tableId;
            editTable(tableId);
        });
    });

    // Gestionnaire pour le bouton supprimer
    document.querySelectorAll('[data-action="delete"]').forEach(button => {
        button.addEventListener('click', function() {
            const tableId = this.closest('.table-card').dataset.tableId;
            deleteTable(tableId);
        });
    });
}

function initializeFormValidation() {
    const forms = document.querySelectorAll('.table-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!validateForm(this)) {
                event.preventDefault();
                event.stopPropagation();
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    
    // Validation du nom
    const nameInput = form.querySelector('[name="table[name]"]');
    if (!nameInput.value.trim()) {
        showError(nameInput, 'Le nom est requis');
        isValid = false;
    }

    // Validation de la capacité
    const capacityInput = form.querySelector('[name="table[capacity]"]');
    if (!capacityInput.value || capacityInput.value < 1) {
        showError(capacityInput, 'La capacité doit être supérieure à 0');
        isValid = false;
    }

    // Validation de la profondeur
    const depthInput = form.querySelector('[name="table[depth]"]');
    if (!depthInput.value || depthInput.value <= 0) {
        showError(depthInput, 'La profondeur doit être supérieure à 0');
        isValid = false;
    }

    return isValid;
}

function showError(input, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    input.classList.add('is-invalid');
    input.parentNode.appendChild(errorDiv);
}

async function viewTableDetails(tableId) {
    try {
        const response = await fetch(`/api/inventory/tables/${tableId}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des détails');
        
        const data = await response.json();
        displayTableDetails(data);
    } catch (error) {
        showNotification('error', 'Erreur lors de la récupération des détails');
    }
}

async function editTable(tableId) {
    try {
        const response = await fetch(`/api/inventory/tables/${tableId}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des données');
        
        const data = await response.json();
        populateEditForm(data);
        
        const modal = new bootstrap.Modal(document.getElementById('editTableModal'));
        modal.show();
    } catch (error) {
        showNotification('error', 'Erreur lors de la modification');
    }
}

async function deleteTable(tableId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette table ?')) {
        return;
    }

    try {
        const response = await fetch(`/api/inventory/tables/${tableId}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            }
        });

        if (!response.ok) throw new Error('Erreur lors de la suppression');
        
        document.querySelector(`[data-table-id="${tableId}"]`).remove();
        showNotification('success', 'Table supprimée avec succès');
    } catch (error) {
        showNotification('error', 'Erreur lors de la suppression');
    }
}

function showNotification(type, message) {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    document.getElementById('toast-container').appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}
