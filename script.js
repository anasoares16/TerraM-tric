// 1. CONFIGURAÇÃO SUPABASE
// Substitua pelas suas credenciais reais do painel do Supabase
const SUPABASE_URL = 'https://apathtuwgsjgcqhmhfcl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_LtRbf8S8cPwGrG0MAXtnDA_HlbjDIym';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Seletores Principais
const startBtn = document.getElementById('startBtn');
const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const userArea = document.getElementById('userArea');
const openQuizBtn = document.getElementById('openQuizBtn');
const quizModal = document.getElementById('quizModal');
const viewReportBtn = document.getElementById('viewReportBtn');
const reportSection = document.getElementById('reportSection');
const paperModal = document.getElementById('paperModal');

let scores = {};

// 2. FLUXO DE LOGIN & AUTH (INTEGRADO AO SUPABASE)
startBtn.onclick = () => loginModal.style.display = 'flex';

loginBtn.onclick = async () => {
    const email = document.getElementById('username').value; // O campo agora deve receber um email
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert("Preencha e-mail e senha.");
        return;
    }

    // Tenta entrar
    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });

    if (error) {
        // Se falhar (usuário não existe), tenta cadastrar automaticamente
        const { error: signUpError } = await _supabase.auth.signUp({ email, password });
        if (signUpError) {
            alert("Erro na autenticação: " + signUpError.message);
            return;
        }
        alert("Conta criada com sucesso! Verifique seu e-mail (se houver confirmação).");
    } else {
        console.log("Login realizado!");
    }

    // Atualiza a tela após login com sucesso
    document.getElementById('userNameDisplay').innerText = email.split('@')[0];
    loginModal.style.display = 'none';
    userArea.style.display = 'block';
    userArea.scrollIntoView({ behavior: 'smooth' });
};

// 3. FLUXO DO QUIZ
openQuizBtn.onclick = () => quizModal.style.display = 'flex';

document.querySelectorAll('.opt-btn').forEach(btn => {
    btn.onclick = () => {
        const nextId = btn.getAttribute('data-next');
        const score = parseInt(btn.getAttribute('data-score'));
        const currentQuestion = btn.closest('.question');
        
        scores[currentQuestion.id] = score;
        
        currentQuestion.classList.remove('active');
        document.getElementById(nextId).classList.add('active');
    };
});

// 4. RELATÓRIO E SALVAMENTO NO BANCO
viewReportBtn.onclick = async () => {
    quizModal.style.display = 'none';
    reportSection.style.display = 'block';
    
    // Gera os dados visuais
    renderDashboard();
    
    // SALVA NO SUPABASE
    await salvarNoSupabase();
    
    reportSection.scrollIntoView({ behavior: 'smooth' });
};

async function salvarNoSupabase() {
    const { data: { user } } = await _supabase.auth.getUser();

    if (!user) {
        console.warn("Usuário não está logado formalmente. Dados não salvos.");
        return;
    }

    const { error } = await _supabase.from('questionarios').insert([
        { 
            user_id: user.id, 
            score_total: Object.values(scores).reduce((a, b) => a + b, 0),
            dados_completos: scores 
        }
    ]);

    if (error) console.error("Erro ao salvar no banco:", error);
    else console.log("Resultados armazenados com sucesso!");
}

function renderDashboard() {
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const pollutionLevel = Math.max(10, 100 - (totalScore * 5));

    const ctx = document.getElementById('pollutionChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Sua Empresa', 'Média Brasil'],
            datasets: [{
                label: 'Nível de Poluição (%)',
                data: [pollutionLevel, 65],
                backgroundColor: ['#52b788', '#ff9f1c']
            }]
        },
        options: { scales: { y: { beginAtZero: true, max: 100 } } }
    });

    const tbody = document.querySelector('#resultTable tbody');
    tbody.innerHTML = `
        <tr>
            <td>CO2</td>
            <td>${pollutionLevel}%</td>
            <td>70%</td>
            <td>Implementar filtros de ar e transição energética.</td>
        </tr>
        <tr>
            <td>Resíduos</td>
            <td>${(5 - (scores.q2 || 1)) * 20}%</td>
            <td>60%</td>
            <td>Logística reversa e reciclagem industrial.</td>
        </tr>
    `;
}

// 5. FLUXO DE PAPEL
document.getElementById('openPaperModal').onclick = () => {
    paperModal.style.display = 'flex';
};

function showPaperCalc(show) {
    if(show) {
        document.getElementById('paperStep1').style.display = 'none';
        document.getElementById('paperStep2').style.display = 'block';
    } else {
        document.getElementById('paperResult').innerHTML = "Ótimo! Sua empresa já é digital.";
        document.getElementById('paperStep1').style.display = 'none';
    }
}

document.getElementById('calcPaperFinal').onclick = () => {
    const qty = document.getElementById('paperQty').value;
    const type = document.getElementById('paperType').value;
    const factor = type === 'reciclado' ? 0.002 : 0.005;
    const result = qty * factor;
    
    document.getElementById('paperResult').innerHTML = `
        <div style="margin-top:20px; padding:15px; background:#f0f0f0; border-radius: 8px;">
            <strong>Resultado:</strong> Sua empresa emite ${result.toFixed(2)}kg de CO2 por mês apenas com papel.
        </div>
    `;
};

function closePaperModal() { paperModal.style.display = 'none'; }