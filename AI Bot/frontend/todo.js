// todo.js - Fetches and manages tasks from real backend API
const API_BASE = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const taskInput = document.getElementById('taskInput');
    const addButton = document.getElementById('addButton');
    const taskList = document.getElementById('taskList');

    // Load tasks from backend
    fetchTasks();

    addButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    async function fetchTasks() {
        try {
            const res = await fetch(`${API_BASE}/tasks`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 401) { logout(); return; }
            const tasks = await res.json();
            taskList.innerHTML = '';
            tasks.forEach(task => taskList.appendChild(createTaskElement(task)));
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
        }
    }

    async function addTask() {
        const text = taskInput.value.trim();
        if (!text) return;

        try {
            const res = await fetch(`${API_BASE}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ text })
            });
            if (res.status === 401) { logout(); return; }
            const task = await res.json();
            taskList.prepend(createTaskElement(task));
            taskInput.value = '';
            taskInput.focus();
        } catch (err) {
            console.error('Failed to add task:', err);
        }
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task._id;

        li.innerHTML = `
            <label class="checkbox-container">
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="checkmark"></span>
            </label>
            <span class="task-text">${escapeHTML(task.text)}</span>
            <button class="delete-btn" aria-label="Delete task">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </button>
        `;

        const checkbox = li.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => toggleTask(task._id, li));

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(task._id, li));

        return li;
    }

    async function toggleTask(id, liElement) {
        const isCompleted = liElement.classList.contains('completed');
        try {
            const res = await fetch(`${API_BASE}/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ completed: !isCompleted })
            });
            if (res.status === 401) { logout(); return; }
            const updated = await res.json();
            if (updated.completed) {
                liElement.classList.add('completed');
            } else {
                liElement.classList.remove('completed');
            }
        } catch (err) {
            console.error('Failed to toggle task:', err);
        }
    }

    async function deleteTask(id, liElement) {
        liElement.classList.add('removing');
        try {
            const res = await fetch(`${API_BASE}/tasks/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 401) { logout(); return; }
            setTimeout(() => liElement.remove(), 300);
        } catch (err) {
            liElement.classList.remove('removing');
            console.error('Failed to delete task:', err);
        }
    }

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('displayName');
        window.location.href = 'login.html';
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
});
