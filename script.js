// Scroll suave para produtos
function scrollToProducts() {
    const produtos = document.getElementById("produtos");
    produtos.scrollIntoView({ behavior: "smooth" });
}

// Simular envio de formulário
const contatoForm = document.getElementById("contatoForm");
contatoForm.addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Mensagem enviada com sucesso!");
    contatoForm.reset();
});