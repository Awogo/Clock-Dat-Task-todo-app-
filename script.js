let todos = [];
const API_BASE = "https://x8ki-letl-twmt.n7.xano.io/api:qnJ3g1MC";

async function deleteTodo(id) {
    await fetch(`${API_BASE}/todo/${id}`, {
        method: "DELETE"
    });
    loadTodos();
}

// Show/Hide Pages
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Modal Functions
function showLogin() {
    document.getElementById('loginModal').classList.add('active');
}

function closeLogin() {
    document.getElementById('loginModal').classList.remove('active');
}

function showSignup() {
    document.getElementById('signupModal').classList.add('active');
}

function closeSignup() {
    document.getElementById('signupModal').classList.remove('active');
}

function switchToSignup() {
    closeLogin();
    showSignup();
}

function switchToLogin() {
    closeSignup();
    showLogin();
}


// Auth Functions
function login(event) {
    event.preventDefault();
    closeLogin();
    showPage('todoPage');
    loadTodos();
}

function signup(event) {
    event.preventDefault();
    closeSignup();
    showPage('todoPage');
    loadTodos();
}

function logout() {
    showPage('landingPage');
    todos = [];
}


// ----------------------------------------------------------
// Todo Functions
document.getElementById('todoForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const title = document.getElementById('taskInput').value.trim();
    const description = document.getElementById('taskDesc').value.trim();
    const date = document.getElementById('taskDate').value;
    const time = document.getElementById('taskTime').value;

    if (title) {
        const newTodo = {
            title,
            description,
            date,
            time,
            completed: false
        };

        // save to Xano
        await fetch(`${API_BASE}/todo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTodo)
        });

        // reload list from Xano
        loadTodos();

        // clear input fields
        document.getElementById('taskInput').value = '';
        document.getElementById('taskDesc').value = '';
        document.getElementById('taskDate').value = '';
        document.getElementById('taskTime').value = '';
    }
});




async function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);

    await fetch(`${API_BASE}/todo/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            completed: !todo.completed
        })
    });

    loadTodos();
}



async function deleteTodo(id) {
    await fetch(`${API_BASE}/todo/${id}`, {
        method: "DELETE"
    });
    loadTodos();
}


function isOverdue(dateStr, timeStr) {
    if (!dateStr || !timeStr) return false;
    const taskDateTime = new Date(`${dateStr} ${timeStr}`);
    return taskDateTime < new Date();
}

function formatDateTime(dateStr, timeStr) {
    if (!dateStr || !timeStr) return '';
    const date = new Date(`${dateStr} ${timeStr}`);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const formattedTime = date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    return `Due: ${formattedDate}, ${formattedTime}`;
}

function loadTodos() {
    const todoList = document.getElementById('todoList');
    
    if (todos.length === 0) {
        todoList.innerHTML = '<p style="color: white; text-align: center; opacity: 0.7;">No tasks yet. Add one above!</p>';
        return;
    }
    
    todoList.innerHTML = todos.map(todo => {
        const overdue = isOverdue(todo.date, todo.time);
        const borderColor = overdue ? 'border-left: 4px solid #ef4444' : 'border-left: 4px solid #3b82f6';
        
        return `
        <div class="todo-item" style="${borderColor}">
            <div class="task-header">
                <div class="task-title-row">
                    <input 
                        type="checkbox" 
                        class="task-check"
                        ${todo.completed ? 'checked' : ''} 
                        onchange="toggleTodo(${todo.id})"
                    >
                    <span class="task-title" style="${todo.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${escapeHtml(todo.title)}</span>
                </div>
                ${overdue && !todo.completed ? '<span class="overdue-badge">⚠ Overdue</span>' : ''}
            </div>
            
            ${todo.description ? `<p class="task-description">${escapeHtml(todo.description)}</p>` : ''}
            
            <div class="task-footer">
                <span class="task-date">📅 ${formatDateTime(todo.date, todo.time)}</span>
                <div class="task-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
});