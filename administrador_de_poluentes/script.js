const startBtn = document.getElementById('startBtn');
const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const quizModal = document.getElementById('quizModal');
const sections = document.querySelectorAll('.section');
let hasClickedStart = false;

//  login ao clicar em começar
startBtn.addEventListener('click', () => {
    hasClickedStart = true;
    loginModal.style.display = 'flex';
});

//  login e mostrar questionário
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'none';
    quizModal.style.display = 'flex';
    quizModal.classList.add('visible');
});

// Navegação no questionário
document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', () => {
        const next = option.getAttribute('data-next');
        document.querySelectorAll('.question').forEach(q => q.classList.remove('active'));
        document.getElementById(next).classList.add('active');
    });
});

// Fechar questionário
function closeQuiz() {
    quizModal.style.display = 'none';
}

// Detectar scroll e mostrar seções (sempre, independente de hasClickedStart)
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    sections.forEach(section => {
        if (scrollTop > section.offsetTop - window.innerHeight + 100) {
            section.classList.add('visible');
        }
    });
});