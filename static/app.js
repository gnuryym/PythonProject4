// ====== ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ ======
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
    document.querySelector(`.nav a[onclick="showPage('${pageId}')"]`)?.classList.add('active');
}

// ====== ЛОГИН И РЕГИСТРАЦИЯ ======
let currentUser = null;

function login() {
    const name = document.getElementById('loginName').value;
    const pass = document.getElementById('loginPass').value;

    fetch('http://127.0.0.1:5000/login', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({name, pass})
    })
    .then(res => res.json())
    .then(data => {
        if(data.success){
            currentUser = data.user;
            alert('Вы вошли!');
            showPage('main');
            renderProfile();
        } else {
            alert('Неверный логин или пароль');
        }
    })
    .catch(e => console.error(e));
}

function register() {
    const name = document.getElementById('regName').value;
    const pass = document.getElementById('regPass').value;
    const role = document.getElementById('regRole').value;

    fetch('http://127.0.0.1:5000/register', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({name, pass, role})
    })
    .then(res => res.json())
    .then(data => {
        if(data.success){
            alert('Регистрация успешна! Войдите в систему.');
            showPage('login');
        } else {
            alert('Ошибка регистрации: ' + data.message);
        }
    })
    .catch(e => console.error(e));
}

function logout() {
    currentUser = null;
    showPage('login');
}

// ====== ПРОФИЛЬ ======
function renderProfile() {
    if(!currentUser) return;
    document.getElementById('profName').innerText = currentUser.name;
    document.getElementById('profRole').innerText = currentUser.role;
    document.getElementById('profTech').innerText = currentUser.techs || 'Не указано';
    document.querySelector('.profile-page .avatar').style.background = `url('${currentUser.photo || 'DockLee.png'}') center/cover`;
}

// ====== СПИСОК ПОЛЬЗОВАТЕЛЕЙ ======
const users = [
    {name:'Алексей', role:'Fullstack разработчик', techs:'Python, React', photo:'user1.jpg'},
    {name:'Мария', role:'UI/UX Дизайнер', techs:'Figma, Photoshop', photo:'user2.jpg'},
    {name:'Иван', role:'Back-end разработчик', techs:'Node.js, MongoDB', photo:'user3.jpg'},
    {name:'Екатерина', role:'Маркетолог', techs:'SMM, SEO', photo:'user4.jpg'}
];

function renderUsers() {
    const container = document.getElementById('usersList');
    container.innerHTML = '';
    const filter = document.getElementById('filterRole').value.toLowerCase();
    const search = document.getElementById('searchInput').value.toLowerCase();

    users.filter(u => {
        return (!filter || u.role.toLowerCase() === filter) &&
               (!search || u.name.toLowerCase().includes(search) || (u.techs && u.techs.toLowerCase().includes(search)));
    }).forEach(u => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${u.photo}" alt="User">
            <div class="card-info">
                <h3>${u.name}</h3>
                <p>${u.role}</p>
            </div>
            <div class="card-actions">
                <img src="heart.png" alt="Favorite" title="Добавить в избранное" onclick="addFavorite('${u.name}')">
                <img src="chat.png" alt="Chat" title="Начать чат" onclick="startChat('${u.name}')">
            </div>
        `;
        container.appendChild(card);
    });
}

document.getElementById('filterRole').addEventListener('change', renderUsers);
document.getElementById('searchInput').addEventListener('input', renderUsers);

// ====== ИЗБРАННОЕ ======
let favorites = [];

function addFavorite(name){
    if(!favorites.includes(name)) favorites.push(name);
    renderFavorites();
}

function renderFavorites(){
    const container = document.getElementById('favList');
    container.innerHTML = '';
    favorites.forEach(name => {
        const user = users.find(u => u.name === name);
        if(!user) return;
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${user.photo}" alt="User">
            <div class="card-info">
                <h3>${user.name}</h3>
                <p>${user.role}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// ====== ЧАТ ======
let currentChat = null;
const chatMessages = {};

function startChat(name){
    currentChat = name;
    if(!chatMessages[name]) chatMessages[name] = [];
    showPage('chats');
    renderChat();
}

function renderChat(){
    const container = document.getElementById('chatList');
    container.innerHTML = '';
    if(!currentChat) return;

    const messages = chatMessages[currentChat];
    messages.forEach(msg => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${msg.userPhoto}" alt="User">
            <div class="card-info">
                <h3>${msg.user}</h3>
                <p>${msg.text}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// ====== ИНИЦИАЛИЗАЦИЯ ======
renderUsers();
renderFavorites();
