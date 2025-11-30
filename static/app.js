// app.js

let currentUser = null;
let currentChatWith = null;

const demoUsers = [
    {name:"Абильмансур", role:"Back-end разработчик", tech:"Python, Go, C#", avatar:"user1.jpg", fav:[]},
    {name:"Мейржан", role:"UI/UX Дизайнер", tech:"Figma, Canva, Adobe XD", avatar:"user2.jpg", fav:[]},
    {name:"Рустем", role:"Fullstack разработчик", tech:"React, Node.js, MongoDB", avatar:"user3.jpg", fav:[]},
    {name:"Даниил", role:"Маркетолог", tech:"SMM, SEO, Google Ads", avatar:"user4.jpg", fav:[]}
];

function getAllUsers() { return JSON.parse(localStorage.getItem('inf_users_v3') || '[]'); }
function saveAllUsers(u) { localStorage.setItem('inf_users_v3', JSON.stringify(u)); }
function getMessages() { return JSON.parse(localStorage.getItem('inf_messages_v3') || '[]'); }
function saveMessages(m) { localStorage.setItem('inf_messages_v3', JSON.stringify(m)); }

if (!getAllUsers().length) saveAllUsers(demoUsers);

const savedUser = localStorage.getItem('inf_current_v3');
if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showPage('main');
} else {
    showPage('login');
}

function showPage(id){
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.nav a').forEach(a=>a.classList.remove('active'));
    if(id!=='login' && id!=='register' && id!=='chatOpen'){
        const navLink=document.querySelector(`.nav a[onclick="showPage('${id}')"]`);
        if(navLink) navLink.classList.add('active');
    }
    if(id==='main') renderUsers();
    if(id==='favorites') renderFavorites();
    if(id==='chats') renderChatList();
    if(id==='profile') renderProfile();
}

function register(){
    const name=document.getElementById('regName').value.trim();
    const pass=document.getElementById('regPass').value;
    const role=document.getElementById('regRole').value;
    if(!name || !pass) return alert('Заполните все поля!');
    let users=getAllUsers();
    if(users.find(u=>u.name===name)) return alert('Такой ник уже занят!');
    const newUser={name, pass, role, tech:'', fav:[]};
    users.push(newUser);
    saveAllUsers(users);
    currentUser=newUser;
    localStorage.setItem('inf_current_v3', JSON.stringify(newUser));
    alert('Добро пожаловать, '+name+'!');
    showPage('main');
}

function login(){
    const name=document.getElementById('loginName').value.trim();
    const pass=document.getElementById('loginPass').value;
    const users=getAllUsers();
    const user=users.find(u=>u.name===name && u.pass===pass);
    if(!user) return alert('Неверный логин или пароль!');
    currentUser=user;
    localStorage.setItem('inf_current_v3', JSON.stringify(user));
    showPage('main');
}

function logout(){
    localStorage.removeItem('inf_current_v3');
    currentUser=null;
    showPage('login');
}

function renderUsers(){
    const list=document.getElementById('usersList');
    list.innerHTML='';
    if(!currentUser) return;
    const q=(document.getElementById('searchInput')?.value || '').toLowerCase();
    const roleFilter=document.getElementById('filterRole')?.value || '';
    getAllUsers().forEach(u=>{
        if(u.name===currentUser.name) return;
        const name=u.name.toLowerCase();
        const tech=(u.tech||'').toLowerCase();
        if(q && !name.includes(q) && !tech.includes(q)) return;
        if(roleFilter && u.role!==roleFilter) return;
        const isFav=(currentUser.fav||[]).includes(u.name);
        const avatar=u.avatar||'DockLee.png';
        const div=document.createElement('div');
        div.className='card';
        div.innerHTML=`
            <img src="${avatar}" onerror="this.onerror=null;this.src='DockLee.png';">
            <div class="card-info">
                <h3>${u.name}</h3>
                <p>${u.role}<br><span style="color:#777;font-size:15px;">${u.tech}</span></p>
            </div>
            <div class="card-actions">
                <img src="${isFav?'Red.png':'Heart.png'}"
                     onclick="toggleFav('${u.name}', this)"
                     style="filter:${isFav?'none':'grayscale(100%)'};">
                <img src="Comment.png" onclick="openChat('${u.name}')">
            </div>
        `;
        list.appendChild(div);
    });
}

function toggleFav(name, el){
    let users=getAllUsers();
    const me=users.find(u=>u.name===currentUser.name);
    const idx=me.fav?.indexOf(name)??-1;
    if(idx===-1){
        me.fav=[...(me.fav||[]), name];
        el.src="Red.png";
        el.style.filter="none";
    } else {
        me.fav.splice(idx,1);
        el.src="Heart.png";
        el.style.filter="grayscale(100%)";
    }
    saveAllUsers(users);
    currentUser=me;
    localStorage.setItem('inf_current_v3', JSON.stringify(me));
    renderFavorites();
}

function renderFavorites(){
    const list=document.getElementById('favList');
    list.innerHTML='';
    const favs=currentUser?.fav||[];
    if(!favs.length){
        list.innerHTML='<p style="text-align:center;color:#777;font-size:20px;margin-top:50px;">Пока никого нет в избранном</p>';
        return;
    }
    getAllUsers().forEach(u=>{
        if(favs.includes(u.name)){
            const div=document.createElement('div');
            div.className='card';
            div.innerHTML=`<img src="${u.avatar}"><div class="card-info"><h3>${u.name}</h3><p>${u.role}<br><span style="color:#777;font-size:15px;">${u.tech}</span></p></div>`;
            list.appendChild(div);
        }
    });
}

function renderChatList(){
    const list=document.getElementById('chatList');
    list.innerHTML='';
    getAllUsers().forEach(u=>{
        if(u.name===currentUser.name) return;
        const div=document.createElement('div');
        div.className='card';
        div.style.cursor='pointer';
        div.onclick=()=>openChat(u.name);
        div.innerHTML=`<img src="${u.avatar}"><div class="card-info"><h3>${u.name}</h3><p>Нажмите, чтобы написать</p></div>`;
        list.appendChild(div);
    });
}

function openChat(name){
    const user=getAllUsers().find(u=>u.name===name);
    currentChatWith=name;
    document.getElementById('chatAvatar').src=user.avatar;
    document.getElementById('chatName').textContent=name;
    showPage('chatOpen');
    loadMessages();
}

function loadMessages(){
    const div=document.getElementById('messages');
    div.innerHTML='';
    const msgs=getMessages().filter(m=>
        (m.from===currentUser.name && m.to===currentChatWith) ||
        (m.from===currentChatWith && m.to===currentUser.name)
    );
    msgs.forEach(m=>{
        const el=document.createElement('div');
        el.className='message '+(m.from===currentUser.name?'me':'other');
        el.textContent=m.text;
        div.appendChild(el);
    });
    div.scrollTop=div.scrollHeight;
}

function sendMessage(){
    const input=document.getElementById('msgInput');
    const text=input.value.trim();
    if(!text) return;
    const msgs=getMessages();
    msgs.push({from:currentUser.name,to:currentChatWith,text,time:Date.now()});
    saveMessages(msgs);
    input.value='';
    loadMessages();
}

function renderProfile(){
    document.getElementById('profName').textContent=currentUser?.name||'—';
    document.getElementById('profRole').textContent=currentUser?.role||'—';
    document.getElementById('profTech').textContent=currentUser?.tech||'—';
}

document.addEventListener('DOMContentLoaded',()=>{
    const input=document.getElementById('searchInput');
    const role=document.getElementById('filterRole');
    if(input) input.addEventListener('input',renderUsers);
    if(role) role.addEventListener('change',renderUsers);
    renderUsers();
});
