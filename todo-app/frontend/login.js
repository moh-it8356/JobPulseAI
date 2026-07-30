// login.js - communicates with /api/auth backend
const API_BASE = 'http://localhost:5000/api';
let currentMode = 'login'; // 'login' or 'register'

function switchTab(mode) {
    currentMode = mode;
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const formTitle = document.getElementById('formTitle');
    const formSubtitle = document.getElementById('formSubtitle');
    const submitBtn = document.getElementById('submitBtn');

    if (mode === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        formTitle.textContent = 'Welcome Back';
        formSubtitle.textContent = 'Sign in to your account';
        submitBtn.textContent = 'Sign In';
    } else {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        formTitle.textContent = 'Create Account';
        formSubtitle.textContent = 'Register to get started';
        submitBtn.textContent = 'Create Account';
    }

    document.getElementById('errorMessage').textContent = '';
    document.getElementById('errorMessage').classList.remove('show');
}

document.addEventListener('DOMContentLoaded', () => {
    // If already logged in, redirect
    if (localStorage.getItem('token')) {
        window.location.href = 'index.html';
        return;
    }

    const authForm = document.getElementById('authForm');
    const errorMessage = document.getElementById('errorMessage');
    const submitBtn = document.getElementById('submitBtn');

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            showError('Please fill in all fields.');
            return;
        }

        submitBtn.textContent = 'Please wait...';
        submitBtn.disabled = true;
        errorMessage.classList.remove('show');

        const endpoint = currentMode === 'login' ? '/auth/login' : '/auth/register';

        try {
            const res = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!res.ok) {
                showError(data.message || 'Something went wrong. Try again.');
                submitBtn.textContent = currentMode === 'login' ? 'Sign In' : 'Create Account';
                submitBtn.disabled = false;
                return;
            }

            // Save token and username
            localStorage.setItem('token', data.token);
            localStorage.setItem('displayName', data.username);
            window.location.href = 'index.html';

        } catch (err) {
            showError('Cannot connect to server. Is it running?');
            submitBtn.textContent = currentMode === 'login' ? 'Sign In' : 'Create Account';
            submitBtn.disabled = false;
        }
    });

    function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.classList.add('show');
    }
});
