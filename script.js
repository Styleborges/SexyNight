// Sistema de Loading
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
});

// Menu Mobile
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
}

// Fechar menu ao clicar em link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Sistema de Toast
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'trophy' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remover toast após 4 segundos
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}

// Contadores animados
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count')) || parseInt(element.textContent.replace(/\D/g, ''));
    const duration = 2500;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Observador para animar elementos quando visíveis
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            
            // Animar contadores
            if (element.classList.contains('stat-number') || 
                element.classList.contains('trophy-count') ||
                element.classList.contains('stat-value')) {
                animateCounter(element);
            }
            
            // Animação para timeline items
            if (element.classList.contains('timeline-item')) {
                element.classList.add('in-view');
            }
            
            // Efeito de entrada para outros elementos
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
});

// Observar elementos que precisam de animação
document.querySelectorAll('.stat-number, .trophy-count, .stat-value, .timeline-item, .trophy-card, .legend-card, .highlight-card, .player').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// Sistema de Áudio
const audioToggle = document.getElementById('audioToggle');
let audioEnabled = false;

// Criar elemento de áudio com hino do Flamengo
const audio = new Audio('https://cdn.jsdelivr.net/gh/Styleborges/chat-ia-site.io/HINO%20DO%20FLAMENGO.mp3'); // Substituir pelo hino real
audio.loop = true;
audio.volume = 0.3;

if (audioToggle) {
    audioToggle.addEventListener('click', () => {
        audioEnabled = !audioEnabled;
        
        if (audioEnabled) {
            audio.play().catch(e => {
                console.log('Autoplay bloqueado pelo navegador');
                showToast('Clique novamente para reproduzir o hino', 'info');
                audioEnabled = false;
            });
            audioToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            audioToggle.style.background = '#ff0000';
            showToast('Hino do Flamengo ativado! 🎶', 'success');
        } else {
            audio.pause();
            audioToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            audioToggle.style.background = 'transparent';
            showToast('Áudio pausado', 'info');
        }
    });
}

// Modal da Conquista 2025
const championModal = document.getElementById('championModal');
const closeModal = document.querySelector('.modal-close');
const celebrateBtn = document.getElementById('celebrateBtn');

// Abrir modal automático após 5 segundos
setTimeout(() => {
    if (championModal) {
        championModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}, 5000);

if (closeModal) {
    closeModal.addEventListener('click', () => {
        championModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

if (celebrateBtn) {
    celebrateBtn.addEventListener('click', () => {
        showToast('Celebrando o tetra! 🏆🏆🏆🏆', 'success');
        createConfettiStorm();
        championModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

// Fechar modal ao clicar fora
window.addEventListener('click', (e) => {
    if (e.target === championModal) {
        championModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Sistema de Confetti
function createConfettiStorm() {
    const colors = ['#ff0000', '#8b0000', '#000000', '#ffffff'];
    
    for (let i = 0; i < 150; i++) {
        setTimeout(() => {
            createConfetti(colors[i % colors.length]);
        }, i * 20);
    }
    
    // Som de comemoração
    const cheerAudio = new Audio('https://cdn.jsdelivr.net/gh/Styleborges/chat-ia-site.io/fogos-caruaru-foguete-12x1-8.mp3');
    cheerAudio.volume = 0.3;
    cheerAudio.play().catch(e => console.log('Áudio de comemoração não pôde ser reproduzido'));
}

function createConfetti(color = '#ff0000') {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = color;
    confetti.style.width = Math.random() * 10 + 5 + 'px';
    confetti.style.height = Math.random() * 10 + 5 + 'px';
    confetti.style.opacity = Math.random() * 0.7 + 0.3;
    confetti.style.animationDuration = Math.random() * 2 + 2 + 's';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        confetti.remove();
    }, 4000);
}

// Adicionar CSS para confetti
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    .confetti {
        position: fixed;
        background: #ff0000;
        top: -10px;
        z-index: 9999;
        opacity: 0.8;
        animation: fall linear forwards;
    }
    
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// Navegação suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offset = 90;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Sistema de progresso na timeline
function updateTimelineProgress() {
    const scrollPosition = window.scrollY;
    const timelineSection = document.querySelector('.history');
    
    if (!timelineSection) return;
    
    const sectionTop = timelineSection.offsetTop;
    const sectionHeight = timelineSection.offsetHeight;
    const viewportHeight = window.innerHeight;
    
    if (scrollPosition > sectionTop - viewportHeight && 
        scrollPosition < sectionTop + sectionHeight) {
        
        const progress = ((scrollPosition - sectionTop + viewportHeight) / sectionHeight) * 100;
        const progressLine = document.querySelector('.timeline-progress');
        if (progressLine) {
            progressLine.style.height = Math.min(Math.max(progress, 0), 100) + '%';
        }
    }
}

// Event listener para scroll
window.addEventListener('scroll', updateTimelineProgress);

// Sistema de highlight nas seções ativas
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
            link.style.color = '#ff0000';
        }
    });
}

window.addEventListener('scroll', highlightActiveSection);

// Easter Eggs
document.addEventListener('keydown', (e) => {
    // Ctrl + 4 = Mostrar tetra
    if (e.ctrlKey && e.key === '4') {
        showToast('🏆 TETRACAMPEÃO DA LIBERTADORES 2025! 🏆', 'success');
        createConfettiStorm();
    }
    
    // Ctrl + F = Modo flamengo
    if (e.ctrlKey && e.key === 'f') {
        document.body.classList.toggle('flamengo-mode');
        if (document.body.classList.contains('flamengo-mode')) {
            showToast('🔴⚫ MODO FLAMENGO ATIVADO! 🔴⚫', 'success');
        } else {
            showToast('Modo normal', 'info');
        }
    }
    
    // Ctrl + M = Mostrar Maracanã info
    if (e.ctrlKey && e.key === 'm') {
        showToast('⚽ Maracanã: 0 finais da Libertadoras, 4 títulos fora!', 'info');
    }
});

// Adicionar CSS para modo flamengo
const flamengoModeStyle = document.createElement('style');
flamengoModeStyle.textContent = `
    .flamengo-mode {
        filter: hue-rotate(-20deg) saturate(1.1);
    }
    
    .flamengo-mode .hero-title {
        animation: flamengoGlow 2s infinite;
    }
    
    @keyframes flamengoGlow {
        0%, 100% { 
            text-shadow: 0 0 30px rgba(255, 0, 0, 0.8),
                         0 0 60px rgba(255, 0, 0, 0.6),
                         0 0 90px rgba(255, 0, 0, 0.4);
        }
        50% { 
            text-shadow: 0 0 50px rgba(255, 0, 0, 1),
                         0 0 100px rgba(255, 0, 0, 0.8),
                         0 0 150px rgba(255, 0, 0, 0.6);
        }
    }
`;
document.head.appendChild(flamengoModeStyle);

// Informações do Tetra
function showTetraInfo() {
    const info = {
        ano: 2025,
        adversario: "Palmeiras",
        placar: "1 × 0",
        local: "Estádio Monumental, Lima - Peru",
        data: "29 de novembro de 2025",
        gols: "Danilo Luiz da Silva (1)",
        significado: "Primeiro clube brasileiro tetracampeão da Libertadores"
    };
    
    console.log("🏆 INFORMAÇÕES DO TETRACAMPEONATO 2025 🏆");
    console.log("Adversário:", info.adversario);
    console.log("Placar:", info.placar);
    console.log("Local:", info.local);
    console.log("Data:", info.data);
    console.log("Gols:", info.gols);
    console.log("Significado:", info.significado);
}

// Inicializar tudo quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔥 SITE OFICIAL DO FLAMENGO 2025 🔥');
    console.log('📅 Dados atualizados em: 01/12/2025');
    console.log('🏆 Títulos da Libertadores: 4 (1981, 2019, 2022, 2025)');
    console.log('🎮 Easter Eggs disponíveis:');
    console.log('   • Ctrl + 4: Celebrar tetra');
    console.log('   • Ctrl + F: Modo especial');
    console.log('   • Ctrl + M: Info Maracanã');
    
    // Mostrar informações do tetra no console
    showTetraInfo();
    
    // Mostrar toast de boas-vindas
    setTimeout(() => {
        showToast('Bem-vindo à Nação Rubro-Negra 2025! 🔴⚫', 'success');
    }, 3000);
    
    // Iniciar animações iniciais
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.style.animationDelay = '0.5s';
        }
    }, 500);
    
    // Atualizar footer com ano atual
    const footerYear = document.querySelector('.footer-year');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        if (currentYear > 2025) {
            footerYear.textContent = `TETRACAMPEÃO ${currentYear}`;
        }
    }
});

// Atualização em tempo real da data
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    const dateTimeStr = now.toLocaleDateString('pt-BR', options);
    
    // Atualizar no console a cada hora
    if (now.getMinutes() === 0) {
        console.log(`🕒 ${dateTimeStr} - Site ativo`);
    }
}

// Atualizar a cada minuto
setInterval(updateDateTime, 60000);

// Sistema de tooltip para informações
document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', (e) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = element.getAttribute('data-tooltip');
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        
        element.tooltip = tooltip;
    });
    
    element.addEventListener('mouseleave', () => {
        if (element.tooltip) {
            element.tooltip.remove();
            element.tooltip = null;
        }
    });
});

// Scroll suave para o topo ao clicar no logo
const navLogo = document.querySelector('.nav-logo');
if (navLogo) {
    navLogo.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Inicializar highlights
highlightActiveSection();
updateTimelineProgress();

// Mostrar modal de conquista após scroll
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    
    if (scrollPosition > windowHeight && !localStorage.getItem('modalShown')) {
        setTimeout(() => {
            if (championModal) {
                championModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                localStorage.setItem('modalShown', 'true');
            }
        }, 1000);
    }
});