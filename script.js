document.addEventListener("DOMContentLoaded", () => {

const SUPABASE_URL = "https://apathtuwgsjgcqhmhfcl.supabase.co";
const SUPABASE_KEY = "sb_publishable_LtRbf8S8cPwGrG0MAXtnDA_HlbjDIym";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentUser = null;
let totalScore = 0;

// ===== AUTH =====
async function checkSession() {
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    currentUser = data.session.user;
    onLogin();
  }
}

checkSession();

document.getElementById("startBtn").onclick = () => {
  document.getElementById("loginModal").style.display = "flex";
};

document.getElementById("doSignupBtn").onclick = async () => {
  const email = signupEmail.value;
  const password = signupPassword.value;

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
  else alert("Conta criada! Faça login.");
};

document.getElementById("doLoginBtn").onclick = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: loginEmail.value,
    password: loginPassword.value
  });

  if (error) alert(error.message);
  else {
    currentUser = data.user;
    onLogin();
  }
};

function onLogin() {
  loginModal.style.display = "none";
  userArea.style.display = "block";
  userNameDisplay.innerText = currentUser.email;
}

logoutBtn.onclick = async () => {
  await supabase.auth.signOut();
  location.reload();
};

// ===== QUIZ =====
openQuizBtn.onclick = () => {
  quizModal.style.display = "flex";
  totalScore = 0;
};

document.querySelectorAll(".opt-btn").forEach(btn => {
  btn.onclick = e => {
    totalScore += Number(e.target.dataset.score);
    document.querySelector(".question.active").classList.remove("active");
    document.getElementById(e.target.dataset.next).classList.add("active");
  };
});

viewReportBtn.onclick = async () => {
  const dados = {
    user_id: currentUser.id,
    empresa_email: currentUser.email,
    co2_nivel: 50 + totalScore,
    residuos_nivel: 30,
    energia_nivel: 40
  };

  const { error } = await supabase.from("diagnosticos").insert(dados);
  if (error) {
    alert(error.message);
    return;
  }

  quizModal.style.display = "none";
  reportSection.style.display = "block";

  new Chart(pollutionChart, {
    type: "doughnut",
    data: {
      labels: ["CO2", "Resíduos", "Energia"],
      datasets: [{
        data: [dados.co2_nivel, dados.residuos_nivel, dados.energia_nivel]
      }]
    }
  });
};

});
