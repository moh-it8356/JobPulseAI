// settings.js - API-connected settings
const API_BASE = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const displayNameInput = document.getElementById('displayNameInput');
    const saveNameBtn = document.getElementById('saveNameBtn');
    const nameSuccess = document.getElementById('nameSuccess');

    const clearTasksBtn = document.getElementById('clearTasksBtn');
    const clearSuccess = document.getElementById('clearSuccess');

    // Load current name
    displayNameInput.value = localStorage.getItem('displayName') || 'User';

    // Save Display Name (stored in localStorage only — it's just a display label)
    saveNameBtn.addEventListener('click', () => {
        const newName = displayNameInput.value.trim();
        if (newName) {
            localStorage.setItem('displayName', newName);
            showSuccess(nameSuccess);
        }
    });

    // Clear All Tasks via API
    clearTasksBtn.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to delete ALL your tasks? This cannot be undone.')) return;

        try {
            const res = await fetch(`${API_BASE}/tasks`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 401) {
                localStorage.removeItem('token');
                window.location.href = 'login.html';
                return;
            }
            showSuccess(clearSuccess);
        } catch (err) {
            console.error('Failed to clear tasks:', err);
        }
    });

    function showSuccess(element) {
        element.classList.add('show');
        setTimeout(() => element.classList.remove('show'), 3000);
    }
});
