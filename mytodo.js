// State
let todos = [];

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
    renderTodos();
}

function signup(event) {
    event.preventDefault();
    closeSignup();
    showPage('todoPage');
    renderTodos();
}

function logout() {
    showPage('landingPage');
    todos = [];
}

// Todo Functions
document.getElementById('todoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    
    if (text) {
        todos.push({
            id: Date.now(),
            text: text,
            completed: false
        });
        
        input.value = '';
        renderTodos();
    }
});

function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            todo.completed = !todo.completed;
        }
        return todo;
    });
    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    
    if (todos.length === 0) {
        todoList.innerHTML = '<p style="color: white; text-align: center; opacity: 0.7;">No tasks yet. Add one above!</p>';
        return;
    }
    
    todoList.innerHTML = todos.map(todo => `
        <div class="todo-item ${todo.completed ? 'completed' : ''}">
            <input 
                type="checkbox" 
                ${todo.completed ? 'checked' : ''} 
                onchange="toggleTodo(${todo.id})"
            >
            <span>${escapeHtml(todo.text)}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
        </div>
    `).join('');
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
