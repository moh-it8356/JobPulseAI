// auth.js - JWT-based authentication guard
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.endsWith('login.html');

    if (!token && !isLoginPage) {
        window.location.href = 'login.html';
        return;
    }

    if (token && isLoginPage) {
        window.location.href = 'index.html';
        return;
    }

    // Set display name in nav
    const displayNameElem = document.getElementById('userDisplayName');
    if (displayNameElem) {
        displayNameElem.textContent = localStorage.getItem('displayName') || 'User';
    }

    // Handle logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('displayName');
            window.location.href = 'login.html';
        });
    }
});
