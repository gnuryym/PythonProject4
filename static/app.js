let currentUser = null;
let currentChatWith = null;

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');

    document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
    if (id !== 'login' && id !== 'register' && id !== 'chatOpen') {
        document.querySelector(`.nav a[onclick="showPage('${id}')"]`)?.classList.add('active');
    }

    if (id === 'main') renderUsers();
    if (id === 'favorites') renderFavorites();
    if (id === 'chats') renderChatList();
    if (id === 'profile') renderProfile();
}

document.addEventListener("DOMContentLoaded", () => {
    const registerBtn = document.getElementById("register-btn");

    registerBtn.addEventListener("click", () => {
        alert("Переходим к регистрации!");
        // сюда добавьте логику формы регистрации
    });
});


async function register() {
    const name = document.getElementById('regName').value.trim();
    const pass = document.getElementById('regPass').value;
    const role = document.getElementById('regRole').value;
    if (!name || !pass) return alert('Заполните все поля!');

    try {
        const res = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, pass, role })
        });
        const data = await res.json();
        if (data.error) return alert(data.error);

        currentUser = data.user;
        localStorage.setItem('inf_current', JSON.stringify(currentUser));
        showPage('main');
    } catch (err) {
        console.error(err);
        alert('Ошибка регистрации');
    }
}

async function login() {
    const name = document.getElementById('loginName').value.trim();
    const pass = document.getElementById('loginPass').value;
    if (!name || !pass) return alert('Введите логин и пароль!');

    try {
        const res = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, pass })
        });
        const data = await res.json();
        if (data.error) return alert(data.error);

        currentUser = data.user;
        localStorage.setItem('inf_current', JSON.stringify(currentUser));
        showPage('main');
    } catch (err) {
        console.error(err);
        alert('Ошибка входа');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('inf_current');
    showPage('login');
}

async function fetchAllUsers() {
    const res = await fetch('/users');
    return res.json();
}

async function renderUsers() {
    const list = document.getElementById('usersList');
    list.innerHTML = '';
    if (!currentUser) return;

    const allUsers = await fetchAllUsers();
    const q = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
    const roleFilter = document.getElementById('filterRole')?.value || '';

    allUsers.forEach(u => {
        if (u.name === currentUser.name) return;

        const name = u.name.toLowerCase();
        const tech = (u.tech || '').toLowerCase();
        if (q && !name.includes(q) && !tech.includes(q)) return;
        if (roleFilter && u.role !== roleFilter) return;

        const isFav = currentUser.fav?.includes(u.name) ?? false;
        const avatar = u.avatar || 'img/DockLee.png';

        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <img src="${avatar}" onerror="this.src='img/DockLee.png'">
            <div class="card-info">
                <h3>${u.name}</h3>
                <p>${u.role}<br><span style="color:#777;font-size:15px;">${u.tech}</span></p>
            </div>
            <div class="card-actions">
                <img src="img/${isFav ? 'Red.png' : 'Heart.png'}"
                     onclick="toggleFav('${u.name}', this)"
                     style="filter:${isFav?'none':'grayscale(100%)'};">
                <img src="img/Comment.png" onclick="openChat('${u.name}')">
            </div>
        `;
        list.appendChild(div);
    });
}

async function toggleFav(name, el) {
    const res = await fetch('/toggle_fav', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser.name, fav: name })
    });
    const data = await res.json();
    currentUser = data.user;
    localStorage.setItem('inf_current', JSON.stringify(currentUser));
    el.src = currentUser.fav.includes(name) ? 'img/Red.png' : 'img/Heart.png';
    el.style.filter = currentUser.fav.includes(name) ? 'none' : 'grayscale(100%)';
    renderFavorites();
}

async function renderFavorites() {
    const list = document.getElementById('favList');
    list.innerHTML = '';
    const favs = currentUser?.fav || [];
    if (!favs.length) {
        list.innerHTML = '<p style="text-align:center;color:#777;font-size:20px;margin-top:50px;">Пока никого нет в избранном</p>';
        return;
    }

    const allUsers = await fetchAllUsers();
    allUsers.forEach(u => {
        if (favs.includes(u.name)) {
            const div = document.createElement('div');
            div.className = 'card';
            div.innerHTML = `<img src="${u.avatar || 'img/DockLee.png'}"><div class="card-info"><h3>${u.name}</h3><p>${u.role}<br><span style="color:#777;font-size:15px;">${u.tech}</span></p></div>`;
            list.appendChild(div);
        }
    });
}

async function renderChatList() {
    const list = document.getElementById('chatList');
    list.innerHTML = '';
    const allUsers = await fetchAllUsers();
    allUsers.forEach(u => {
        if (u.name === currentUser.name) return;
        const div = document.createElement('div');
        div.className = 'card';
        div.style.cursor = 'pointer';
        div.onclick = () => openChat(u.name);
        div.innerHTML = `<img src="${u.avatar || 'img/DockLee.png'}"><div class="card-info"><h3>${u.name}</h3><p>Нажмите, чтобы написать</p></div>`;
        list.appendChild(div);
    });
}

async function openChat(name) {
    currentChatWith = name;
    const allUsers = await fetchAllUsers();
    const user = allUsers.find(u => u.name === name);
    document.getElementById('chatAvatar').src = user.avatar || 'img/DockLee.png';
    document.getElementById('chatName').textContent = name;
    showPage('chatOpen');
    loadMessages();
}

async function loadMessages() {
    const div = document.getElementById('messages');
    div.innerHTML = '';
    const res = await fetch('/messages');
    const msgs = await res.json();
    msgs.filter(m => (m.from === currentUser.name && m.to === currentChatWith) ||
                      (m.from === currentChatWith && m.to === currentUser.name))
        .forEach(m => {
            const el = document.createElement('div');
            el.className = 'message ' + (m.from === currentUser.name ? 'me' : 'other');
            el.textContent = m.text;
            div.appendChild(el);
        });
    div.scrollTop = div.scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById('msgInput');
    const text = input.value.trim();
    if (!text) return;

    await fetch('/send_message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: currentUser.name, to: currentChatWith, text })
    });
    input.value = '';
    loadMessages();
}

function renderProfile() {
    document.getElementById('profName').textContent = currentUser?.name || '—';
    document.getElementById('profRole').textContent = currentUser?.role || '—';
    document.getElementById('profTech').textContent = currentUser?.tech || '—';
}

document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('inf_current');
    if (saved) {
        currentUser = JSON.parse(saved);
        showPage('main');
    } else {
        showPage('login');
    }

    document.getElementById('searchInput')?.addEventListener('input', renderUsers);
    document.getElementById('filterRole')?.addEventListener('change', renderUsers);
});
