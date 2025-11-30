<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Infinity – поиск специалистов для стартапа</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
    @import url('https://fonts.googleapis.com/css2?family=Braah+One&family=Inter:wght@400;500;600&display=swap');

    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter', sans-serif; background: linear-gradient(135deg,#A1C4FD 0%,#C2E9FB 100%); min-height:100vh; color:#000; }
    .header { height:90px; background:rgba(255,255,255,0.95); backdrop-filter:blur(10px); border-bottom:1px solid #ddd; position:fixed; top:0; left:0; right:0; z-index:1000; display:flex; align-items:center; justify-content:space-between; padding:0 60px; box-shadow:0 4px 20px rgba(0,0,0,0.08); }
    .logo { width:70px; height:70px; background: url('img/Infinity.png') center/contain no-repeat; }
    .nav { display:flex; justify-content:center; flex:1; gap:80px; font-size:19px; font-weight:500; }
    .nav a { text-decoration:none; color:#333; padding:12px 20px; border-radius:12px; transition:all 0.3s; position:relative; cursor:pointer; }
    .nav a:hover { background:rgba(91,134,229,0.1); color:#5B86E5; }
    .nav a.active { color:#5B86E5; font-weight:600; }
    .nav a.active::after { content:''; position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:40px; height:4px; background:#5B86E5; border-radius:2px; }

    .content { margin-top:110px; padding:40px 60px; max-width:1600px; margin-left:auto; margin-right:auto; }
    .page { display:none; }
    .page.active { display:block; }

    .users-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(420px,1fr)); gap:30px; margin-top:30px; }
    .card { background:#fff; border-radius:28px; padding:32px; display:flex; align-items:center; gap:28px; box-shadow:0 10px 30px rgba(0,0,0,0.12); transition: all 0.4s ease; height:180px; }
    .card:hover { transform:translateY(-10px); box-shadow:0 20px 40px rgba(0,0,0,0.18); }
    .card img { width:110px; height:110px; border-radius:50%; object-fit:cover; border:4px solid #f0f0f0; }
    .card-info h3 { font-size:26px; margin-bottom:8px; font-weight:600; }
    .card-info p { font-size:17px; color:#555; line-height:1.5; }
    .card-actions { margin-left:auto; display:flex; flex-direction:column; gap:18px; }
    .card-actions img { width:40px; height:40px; cursor:pointer; transition:0.3s; }
    .card-actions img:hover { transform:scale(1.15); }

    .profile-page { background:rgba(255,255,255,0.97); border-radius:32px; padding:60px; max-width:600px; margin:40px auto; text-align:center; box-shadow:0 20px 50px rgba(0,0,0,0.15); }
    .profile-page .avatar { width:260px; height:260px; border-radius:50%; margin:0 auto 40px; background:url('img/DockLee.png') center/cover; border:12px solid #fff; box-shadow:0 20px 40px rgba(0,0,0,0.2); }
    .profile-field { background:#F8F9FF; border-radius:28px; padding:22px 32px; margin:20px 0; font-size:19px; text-align:left; display:flex; justify-content:space-between; align-items:center; font-weight:500; }

    .chat-window { background:rgba(255,255,255,0.97); border-radius:32px; padding:50px; height:calc(100vh - 180px); display:flex; flex-direction:column; box-shadow:0 20px 50px rgba(0,0,0,0.15); }
    .chat-messages { flex:1; overflow-y:auto; padding:20px 0; }
    .message { max-width:70%; padding:16px 24px; border-radius:24px; margin:12px 0; font-size:17px; line-height:1.5; }
    .message.me { background:#5B86E5; color:white; margin-left:auto; border-bottom-right-radius:6px; }
    .message.other { background:#F0F2F5; margin-right:auto; border-bottom-left-radius:6px; }

    .auth-container { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:40px; }
    .auth-card { background:#fff; border-radius:32px; padding:70px 90px; max-width:560px; text-align:center; box-shadow:0 30px 70px rgba(0,0,0,0.2); }
    .auth-card h1 { font-family:'Braah One', sans-serif; font-size:26px; line-height:1.6; margin-bottom:50px; color:#333; }
    .auth-card input, .auth-card select { width:100%; padding:20px; margin:18px 0; border:none; border-bottom:3px solid #ddd; font-size:19px; background:transparent; transition:0.3s; }
    .auth-card input:focus, .auth-card select:focus { border-color:#5B86E5; }
    .blue-btn { background:#5B86E5; color:white; border:none; padding:20px; width:100%; border-radius:16px; font-size:20px; margin-top:40px; cursor:pointer; font-weight:600; transition:0.3s; }
    .blue-btn:hover { background:#4a75d0; transform:translateY(-2px); }
</style>
</head>
<body>

<div class="header">
    <div class="logo"></div>
    <div class="nav">
        <a onclick="showPage('main')">Главная</a>
        <a onclick="showPage('profile')">Профиль</a>
        <a onclick="showPage('chats')">Чаты</a>
        <a onclick="showPage('favorites')">Избранные</a>
    </div>
    <div style="width:70px;"></div>
</div>

<!-- Страницы -->
<div id="login" class="page active">
    <div class="auth-container">
        <div class="auth-card">
            <h1>Infinity – Вход</h1>
            <input type="text" id="loginName" placeholder="Логин">
            <input type="password" id="loginPass" placeholder="Пароль">
            <button class="blue-btn" onclick="login()">Войти</button>
            <p style="margin-top:30px;color:#666;font-size:16px;">
                Нет аккаунта? <a href="#" onclick="showPage('register')" style="color:#5B86E5;font-weight:600;">Зарегистрироваться</a>
            </p>
        </div>
    </div>
</div>

<div id="register" class="page">
    <div class="auth-container">
        <div class="auth-card">
            <h1>Infinity – Регистрация</h1>
            <input type="text" id="regName" placeholder="Логин">
            <input type="password" id="regPass" placeholder="Пароль">
            <select id="regRole">
                <option>Back-end разработчик</option>
                <option>UI/UX Дизайнер</option>
                <option>Fullstack разработчик</option>
                <option>Маркетолог</option>
            </select>
            <button class="blue-btn" onclick="register()">Зарегистрироваться</button>
        </div>
    </div>
</div>

<div id="main" class="page">
    <div class="content">
        <h1>Найдите специалиста</h1>
        <input id="searchInput" placeholder="Поиск..." style="width:100%;padding:14px;border-radius:12px;border:2px solid #e6e6e6;font-size:16px;margin-bottom:12px;">
        <select id="filterRole" style="width:100%;padding:14px;border-radius:12px;border:2px solid #e6e6e6;font-size:16px;margin-bottom:20px;">
            <option value="">Все роли</option>
            <option>Back-end разработчик</option>
            <option>UI/UX Дизайнер</option>
            <option>Fullstack разработчик</option>
            <option>Маркетолог</option>
        </select>
        <div class="users-grid" id="usersList"></div>
    </div>
</div>

<div id="profile" class="page">
    <div class="content">
        <div class="profile-page">
            <div class="avatar"></div>
            <div class="profile-field"><span>Имя:</span> <strong id="profName">—</strong></div>
            <div class="profile-field"><span>Роль:</span> <strong id="profRole">—</strong></div>
            <button class="blue-btn" onclick="logout()">Выйти</button>
        </div>
    </div>
</div>

<div id="favorites" class="page">
    <div class="content">
        <h1>Избранные</h1>
        <div class="users-grid" id="favList"></div>
    </div>
</div>

<div id="chats" class="page">
    <div class="content">
        <h1>Чаты</h1>
        <div class="users-grid" id="chatList"></div>
    </div>
</div>

<div id="chatOpen" class="page">
    <div class="content">
        <div class="chat-window">
            <div style="display:flex;align-items:center;gap:20px;margin-bottom:30px;">
                <img id="chatAvatar" src="" style="width:80px;height:80px;border-radius:50%;">
                <h2 id="chatName" style="font-size:28px;">Чат</h2>
            </div>
            <div class="chat-messages" id="messages"></div>
            <div style="display:flex;gap:15px;margin-top:20px;">
                <input type="text" id="msgInput" placeholder="Напишите сообщение..." style="flex:1;padding:20px;border-radius:30px;border:none;background:#F0F2F5;font-size:17px;">
                <div onclick="sendMessage()" style="width:60px;height:60px;background:#5B86E5;border-radius:50%;color:white;font-size:26px;display:flex;align-items:center;justify-content:center;cursor:pointer;">✔</div>
            </div>
        </div>
    </div>
</div>

<script>
let currentUser = null;
let currentChatWith = null;

function showPage(id){
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
    document.querySelector(`.nav a[onclick="showPage('${id}')"]`)?.classList.add('active');

    if(id==='main') renderUsers();
    if(id==='favorites') renderFavorites();
    if(id==='chats') renderChatList();
    if(id==='profile') renderProfile();
}

async function register(){
    const name=document.getElementById('regName').value.trim();
    const pass=document.getElementById('regPass').value;
    const role=document.getElementById('regRole').value;
    if(!name||!pass) return alert('Заполните все поля!');
    const res=await fetch('/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({login:name,password:pass,role})});
    const data=await res.json();
    if(data.error) return alert(data.error);
    currentUser={name,role,fav:[]};
    showPage('main');
}

async function login(){
    const name=document.getElementById('loginName').value.trim();
    const pass=document.getElementById('loginPass').value;
    if(!name||!pass) return alert('Введите логин и пароль!');
    const res=await fetch('/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({login:name,password:pass})});
    const data=await res.json();
    if(data.error) return alert(data.error);
    currentUser={name:data.login,fav:[]};
    showPage('main');
}

function logout(){currentUser=null;showPage('login');}

async function fetchAllUsers(){const res=await fetch('/profiles');return res.json();}

async function renderUsers(){
    const list=document.getElementById('usersList');
    list.innerHTML='';
    if(!currentUser) return;
    const allUsers=await fetchAllUsers();
    allUsers.forEach(u=>{
        if(u.login===currentUser.name) return;
        const div=document.createElement('div');
        div.className='card';
        div.innerHTML=`<img src="img/DockLee.png"><div class="card-info"><h3>${u.login}</h3><p>${u.role||'—'}</p></div><div class="card-actions"><img src="img/Heart.png" onclick="toggleFav('${u.login}',this)"><img src="img/Comment.png" onclick="openChat('${u.login}')"></div>`;
        list.appendChild(div);
    });
}

async function toggleFav(name,el){
    await fetch('/favorite',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user:currentUser.name,target:name})});
    el.src='img/Red.png';
}

async function renderFavorites(){
    const list=document.getElementById('favList');
    list.innerHTML='';
    const allUsers=await fetchAllUsers();
    allUsers.forEach(u=>{const div=document.createElement('div');div.className='card';div.innerHTML=`<img src="img/DockLee.png"><div class="card-info"><h3>${u.login}</h3><p>${u.role||'—'}</p></div>`;list.appendChild(div);});
}

async function renderChatList(){
    const list=document.getElementById('chatList');
    list.innerHTML='';
    const allUsers=await fetchAllUsers();
    allUsers.forEach(u=>{if(u.login===currentUser.name) return; const div=document.createElement('div');div.className='card';div.onclick=()=>openChat(u.login);div.innerHTML=`<img src="img/DockLee.png"><div class="card-info"><h3>${u.login}</h3><p>Нажмите чтобы писать</p></div>`;list.appendChild(div);});
}

function openChat(name){currentChatWith=name;showPage('chatOpen');document.getElementById('chatName').textContent=name;}

function sendMessage(){/* Здесь можно добавить POST /send_message */ renderChatList();}

function renderProfile(){
    document.getElementById('profName').textContent=currentUser?.name||'—';
    document.getElementById('profRole').textContent=currentUser?.role||'—';
}

document.addEventListener('DOMContentLoaded',()=>{
    showPage('login');
});
</script>

</body>
</html>
