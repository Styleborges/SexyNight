// Usuários de teste (em produção use banco de dados)
const users = [
  { username: "admin", password: "1234" },
  { username: "teste", password: "abcd" }
];

document.getElementById('loginBtn').addEventListener('click', () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const message = document.getElementById('loginMessage');

  const user = users.find(u => u.username === username && u.password === password);

  if(user) {
    message.style.color = "#80ff80";
    message.innerText = `Bem-vindo, ${username}! Redirecionando...`;
    setTimeout(() => {
      window.location.href = "dashboard.html"; // página após login
    }, 1200);
  } else {
    message.style.color = "#ff8080";
    message.innerText = "Usuário ou senha incorretos!";
  }
});
