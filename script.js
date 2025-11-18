// ---------- CONFIG ----------
const CLIENT_ID = "1439907381386547276"; // seu client_id (já fornecido)
const BACKEND_BASE = "http://localhost:3000"; // backend rodando localmente (mude quando publicar)
const DISCORD_INVITE = "https://discord.com/oauth2/authorize?client_id=1439907381386547276&permissions=0&scope=bot%20applications.commands";
const INVITE_SERVER = "https://discord.gg/SEU_SERVIDOR"; // coloque link do seu servidor (ou deixe '#')
// ----------------------------

document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('inviteLinkHeader').href = DISCORD_INVITE;
document.getElementById('serverInviteBtn').href = INVITE_SERVER;
document.getElementById('openDiscord').href = INVITE_SERVER;
document.getElementById('supportInvite').href = INVITE_SERVER;
document.getElementById('buyNow').href = "#produtos";

const loginBtn = document.getElementById('loginBtn');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.getElementById('closeModal');

loginBtn.addEventListener('click', () => {
  // redireciona pro backend que encaminha para o Discord OAuth
  window.location.href = `${BACKEND_BASE}/auth/discord`;
});

// Close modal
document.getElementById('closeModal').addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Buy buttons (demo)
document.querySelectorAll('.buy-btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const item = e.currentTarget.getAttribute('data-item');
    try {
      const res = await fetch(`${BACKEND_BASE}/api/create-invoice`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ item })
      });
      const data = await res.json();
      showModal(`<h3>Pagamento - ${item}</h3>
        <p>Valor: ${data.price_str}</p>
        <p><strong>Link de pagamento (demo):</strong></p>
        <a href="${data.pay_link}" target="_blank">${data.pay_link}</a>
        <p style="margin-top:8px;color:#aaa">Pagamento simulado. Integre um gateway real para produção.</p>`);
    } catch(err){
      showModal('<p>Erro criando compra. Verifique o backend.</p>');
    }
  });
});

function showModal(html){
  modalBody.innerHTML = html;
  modal.classList.remove('hidden');
}

// after oauth callback: backend may redirect to /?token=... or set cookie
(async function tryLoadPanel(){
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token'); // backend might append token in query (DEMO)
  if(token){
    sessionStorage.setItem('access_token', token);
    history.replaceState({}, document.title, window.location.pathname);
  }
  const access = sessionStorage.getItem('access_token');
  if(access){
    try {
      const res = await fetch(`${BACKEND_BASE}/api/panel-data`, {
        headers: { 'Authorization': `Bearer ${access}` }
      });
      if(res.ok){
        const json = await res.json();
        document.getElementById('stat-users').textContent = json.users;
        document.getElementById('stat-guilds').textContent = json.guilds;
        document.getElementById('stat-support').textContent = json.support;
        document.getElementById('openPanel').href = `${BACKEND_BASE}/panel?token=${access}`;
      } else {
        console.warn('Não autorizado no painel');
      }
    } catch(e){
      console.error('Erro ao buscar painel', e);
    }
  }
})();
