// ====== ESTADO GLOBAL ======
let currentUser = {
  name: 'Convidado Borges',
  email: null
};

let history = [];

const authView = document.getElementById('authView');
const chatView = document.getElementById('chatView');

const userNameSpan = document.getElementById('userName');
const firstNameSpan = document.getElementById('firstNameSpan');
const userAvatar = document.getElementById('userAvatar');

const googleLoginBtn = document.getElementById('googleLoginBtn');
const guestLoginBtn = document.getElementById('guestLoginBtn');
const emailLoginForm = document.getElementById('emailLoginForm');
const logoutBtn = document.getElementById('logoutBtn');

const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const clearChatBtn = document.getElementById('clearChatBtn');

// ====== FUNÇÕES DE LOGIN (FAKE LOCAL) ======
function setUser(user) {
  currentUser = user;
  const firstName = (user.name || 'Convidado').split(' ')[0];

  userNameSpan.textContent = user.name;
  firstNameSpan.textContent = firstName;

  const initial = firstName.charAt(0).toUpperCase();
  userAvatar.textContent = initial;

  // salva no localStorage
  localStorage.setItem('borgesUser', JSON.stringify(user));
}

function showChat() {
  authView.classList.add('hidden');
  chatView.classList.remove('hidden');
}

function showAuth() {
  chatView.classList.add('hidden');
  authView.classList.remove('hidden');
}

// Carregar usuário salvo (se tiver)
(function initAuth() {
  const saved = localStorage.getItem('borgesUser');
  if (saved) {
    try {
      const user = JSON.parse(saved);
      setUser(user);
      showChat();
    } catch (e) {
      console.error('Erro lendo usuário salvo:', e);
      localStorage.removeItem('borgesUser');
    }
  }
})();

// Login Google fake
googleLoginBtn.addEventListener('click', () => {
  const fakeUser = {
    name: 'Borges Google',
    email: 'borges.google@example.com',
    provider: 'google'
  };
  setUser(fakeUser);
  showChat();
});

// Login convidado
guestLoginBtn.addEventListener('click', () => {
  const user = {
    name: 'Convidado Borges',
    email: null,
    provider: 'guest'
  };
  setUser(user);
  showChat();
});

// Login com email/senha (fake)
emailLoginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) return;

  const firstPart = email.split('@')[0];
  const capitalized = firstPart.charAt(0).toUpperCase() + firstPart.slice(1);

  const user = {
    name: capitalized,
    email,
    provider: 'email'
  };
  setUser(user);
  showChat();
});

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('borgesUser');
  history = [];
  // limpa mensagens (mantém a primeira mensagem de boas-vindas)
  messagesDiv.innerHTML = `
    <div class="msg bot">
      <div class="msg-meta">
        <span class="msg-sender">Borges IA</span>
        <span class="msg-time">agora</span>
      </div>
      <div class="msg-content">
        Fala, <span id="firstNameSpan">convidado</span>! 👋  
        Eu sou o <strong>Borges IA</strong>. Como posso te ajudar hoje?
      </div>
    </div>
  `;
  showAuth();
});

// ====== CHAT ======
function addMessage(text, sender) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('msg', sender);

  const meta = document.createElement('div');
  meta.classList.add('msg-meta');

  const senderSpan = document.createElement('span');
  senderSpan.classList.add('msg-sender');
  senderSpan.textContent = sender === 'user' ? currentUser.name || 'Você' : 'Borges IA';

  const timeSpan = document.createElement('span');
  timeSpan.classList.add('msg-time');
  timeSpan.textContent = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  meta.appendChild(senderSpan);
  meta.appendChild(timeSpan);

  const content = document.createElement('div');
  content.classList.add('msg-content');
  content.textContent = text;

  wrapper.appendChild(meta);
  wrapper.appendChild(content);
  messagesDiv.appendChild(wrapper);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addLoadingMessage() {
  const wrapper = document.createElement('div');
  wrapper.classList.add('msg', 'bot', 'loading');

  const meta = document.createElement('div');
  meta.classList.add('msg-meta');

  const senderSpan = document.createElement('span');
  senderSpan.classList.add('msg-sender');
  senderSpan.textContent = 'Borges IA';

  const timeSpan = document.createElement('span');
  timeSpan.classList.add('msg-time');
  timeSpan.textContent = 'digitando...';

  meta.appendChild(senderSpan);
  meta.appendChild(timeSpan);

  const content = document.createElement('div');
  content.classList.add('msg-content');

  const dot1 = document.createElement('span');
  dot1.classList.add('dot');
  const dot2 = document.createElement('span');
  dot2.classList.add('dot');
  const dot3 = document.createElement('span');
  dot3.classList.add('dot');

  content.appendChild(dot1);
  content.appendChild(dot2);
  content.appendChild(dot3);

  wrapper.appendChild(meta);
  wrapper.appendChild(content);
  messagesDiv.appendChild(wrapper);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  return wrapper;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  userInput.value = '';
  userInput.focus();

  const loadingEl = addLoadingMessage();
  sendBtn.disabled = true;

  try {
    // DEV: backend local
    const backendUrl = 'http://localhost:3000/api/chat';
    // PRODUÇÃO: depois troca para URL do servidor (ex: https://borges-ia-backend.onrender.com/api/chat)

    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: text,
        history
      })
    });

    const data = await res.json();
    const reply = data.reply || 'Erro ao obter resposta.';

    loadingEl.remove();
    addMessage(reply, 'bot');

    history.push({ role: 'user', content: text });
    history.push({ role: 'assistant', content: reply });

  } catch (err) {
    console.error(err);
    loadingEl.remove();
    addMessage('Erro ao conectar com o servidor Borges IA. Confira se o backend está online.', 'bot');
  } finally {
    sendBtn.disabled = false;
  }
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});

// Limpar chat
clearChatBtn.addEventListener('click', () => {
  history = [];
  messagesDiv.innerHTML = '';
});

// Fim app.js
