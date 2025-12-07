const startBtn = document.getElementById('startBtn');
const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const quizModal = document.getElementById('quizModal');
const calcPaperBtn = document.getElementById('calcPaperBtn');
const paperCalculatorModal = document.getElementById('paperCalculatorModal');
const sections = document.querySelectorAll('.section');
let hasClickedStart = false;

// Abrir login clicando em começar
startBtn.addEventListener('click', () => {
    hasClickedStart = true;
    loginModal.style.display = 'flex';
});

// Fazer login e mostrar questionário
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

// Abrir calculadora de CO2 de papel
calcPaperBtn.addEventListener('click', () => {
    quizModal.style.display = 'none';
    paperCalculatorModal.style.display = 'flex';
});

// Fechar calculadora de papel
function closePaperCalculator() {
    paperCalculatorModal.style.display = 'none';
}

// Função para processar a calculadora de papel
function processar() {
    const produzPapel = document.querySelector('input[name="produzPapel"]:checked')?.value;
    const quantidade = parseFloat(document.getElementById('quantidadePapel').value) || 0;
    const tipoPapel = document.querySelector('input[name="tipoPapel"]:checked')?.value;
    
    let solucao = "";
    let recomendacao = "";
    let carbono = 0;
    
    if (produzPapel === "sim") {
        solucao = "Solução: Implemente processos de reciclagem para reduzir emissões em até 30%.";
        recomendacao = "Recomendação: Realize auditorias mensais e treine a equipe para uso consciente de papel.";
        
        // Cálculo de carbono
        const fatorPadrao = 0.005; // kg CO2e por folha
        const fatorReciclado = 0.0025; // kg CO2e por folha (metade, aproximado)
        const fator = (tipoPapel === "reciclado") ? fatorReciclado : fatorPadrao;
        carbono = quantidade * fator; // Em kg CO2e por mês
    } else {
        solucao = "Solução: Foque em outros setores, como energia renovável.";
        recomendacao = "Recomendação: Avalie emissões gerais com uma ferramenta como a da EPA.";
    }
    
    document.getElementById('resultado').innerHTML = `
        <h2>Resultado</h2>
        <p><strong>Solução:</strong> ${solucao}</p>
        <p><strong>Recomendação:</strong> ${recomendacao}</p>
        ${produzPapel === "sim" ? `<p><strong>Emissões de CO2 estimadas (por mês):</strong> ${carbono.toFixed(2)} kg CO2e</p>` : ""}
    `;
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
