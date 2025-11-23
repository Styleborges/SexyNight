const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

let history = [];

function addMessage(text, sender) {
  const div = document.createElement('div');
  div.classList.add('msg', sender);
  div.textContent = text;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  userInput.value = '';

  sendBtn.disabled = true;
  addMessage('Pensando...', 'bot');
  const loadingMsg = messagesDiv.lastChild;

  try {
    const res = await fetch('http://localhost:3000/api/chat', {
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

    messagesDiv.removeChild(loadingMsg);
    addMessage(reply, 'bot');

    history.push({ role: 'user', content: text });
    history.push({ role: 'assistant', content: reply });

  } catch (err) {
    console.error(err);
    messagesDiv.removeChild(loadingMsg);
    addMessage('Erro de conexão com o servidor.', 'bot');
  } finally {
    sendBtn.disabled = false;
    userInput.focus();
  }
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});
