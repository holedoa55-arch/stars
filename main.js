// Премиум-доступ за "50 звёзд".
// Кнопка "Оплатить" ведёт на Telegram владельца @davny.
// После оплаты владелец выдаёт код из списка в codes.js.
// Ввод кода открывает премиум-раздел и запоминает доступ в браузере.

const FORM_KEY = "stars_premium_access";
const FORM_EXPIRY_KEY = "stars_premium_expiry";

// Квиз: вопросы OSINT с вариантами
const QUIZ = [
  { q: "Что такое OSINT?",
    a: ["Разведка по открытым источникам", "Хакерский взлом", "Вирусная программа", "Вид шифрования"],
    ok: 0 },
  { q: "Что такое WHOIS?",
    a: ["Данные о владельце домена", "Тип браузера", "Антивирус", "Поисковая система"],
    ok: 0 },
  { q: "Какой сервис ищет открытые устройства в интернете?",
    a: ["Shodan", "WordPress", "Photoshop", "Gmail"],
    ok: 0 },
  { q: "Что помогает найти, где ещё встречается картинка?",
    a: ["Обратный поиск по изображению", "Блокчейн", "Веб-камера", "PDF-редактор"],
    ok: 0 },
  { q: "Что такое конфиденциальная утечка данных (data breach)?",
    a: ["Попадание данных в открытый доступ", "Потеря телефона", "Удаление файла", "Смена пароля"],
    ok: 0 },
  { q: "Какой инструмент помогает работать с открытыми реестрами юрлиц в РФ?",
    a: ["ЕГРЮЛ/egrul.nalog.ru", "Google Docs", "Telegram", "Spotify"],
    ok: 0 },
];

document.addEventListener("DOMContentLoaded", () => {
  const locked = document.getElementById("locked");
  const content = document.getElementById("premium-content");

  // Проверка истечения временного премиума (5 минут от квиза)
  const expiry = localStorage.getItem(FORM_EXPIRY_KEY);
  if (expiry && Number(expiry) < Date.now()) {
    localStorage.removeItem(FORM_EXPIRY_KEY);
    localStorage.removeItem(FORM_KEY);
  }

  const hasAccess = localStorage.getItem(FORM_KEY) === "unlocked";

  // Вкладки
  const tabButtons = document.querySelectorAll(".tab");
  const goto = (name) => {
    tabButtons.forEach(b => b.classList.toggle("active", b.dataset.tab === name));
    document.querySelectorAll(".tab-page").forEach(p => p.classList.toggle("active", p.id === "page-" + name));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  tabButtons.forEach(b => b.addEventListener("click", () => goto(b.dataset.tab)));

  // Кнопки «перейти на вкладку» (data-goto)
  document.querySelectorAll("[data-goto]").forEach(btn => {
    btn.addEventListener("click", () => goto(btn.dataset.goto));
  });

  // Если доступ есть — «Премиум» показывает контент
  if (hasAccess) {
    if (locked) locked.style.display = "none";
    if (content) content.style.display = "block";
  }

  // Кнопка «Купить премиум» раскрывает шаги получения доступа
  const buyBtn = document.getElementById("buy-btn");
  const steps = document.getElementById("buy-steps");
  const buyHint = document.getElementById("buy-hint");
  if (buyBtn && steps) {
    buyBtn.addEventListener("click", () => {
      const open = steps.style.display !== "none";
      steps.style.display = open ? "none" : "block";
      buyBtn.textContent = open ? "Купить премиум · 50⭐" : "Свернуть";
      if (buyHint) buyHint.style.display = "none";
    });
  }

  // Автооткрытие вкладки из хеша (#premium, #free...)
  if (window.location.hash) {
    const h = window.location.hash.replace("#", "");
    if (document.querySelector('[data-tab="' + h + '"]')) goto(h);
  }

  initQuiz();
});

function tryCode() {
  const input = document.getElementById("code-input");
  const msg = document.getElementById("code-msg");
  const val = (input.value || "").trim().toUpperCase();

  const valid = Array.isArray(PREMIUM_CODES) && PREMIUM_CODES.map(c => String(c).toUpperCase()).includes(val);

  if (valid) {
    localStorage.setItem(FORM_KEY, "unlocked");
    const locked = document.getElementById("locked");
    const content = document.getElementById("premium-content");
    if (locked) locked.style.display = "none";
    if (content) content.style.display = "block";
    if (msg) { msg.textContent = "Доступ открыт ✦"; msg.style.color = "#37d69f"; }
  } else {
    if (msg) {
      msg.textContent = "Неверный код. Чтобы получить доступ, оплати 50☆ у @davny.";
      msg.style.color = "#ff5d6d";
    }
  }
}

// ------------- КВИЗ -------------
let quizIndex = 0;
let quizAnswered = false;

function initQuiz() {
  const box = document.getElementById("quiz-box");
  if (!box) return;
  quizIndex = 0;
  quizAnswered = false;
  renderQuestion();
}

function renderQuestion() {
  const q = QUIZ[quizIndex];
  const total = QUIZ.length;
  const num = document.getElementById("q-num");
  const totalEl = document.getElementById("q-total");
  const title = document.getElementById("q-title");
  const answers = document.getElementById("q-answers");
  const feedback = document.getElementById("q-feedback");
  const reward = document.getElementById("q-reward");
  const restart = document.getElementById("q-restart");
  const barFill = document.getElementById("q-bar-fill");

  num.textContent = quizIndex + 1;
  totalEl.textContent = total;
  title.textContent = q.q;
  feedback.innerHTML = "";
  feedback.className = "q-feedback";
  reward.style.display = "none";
  restart.style.display = "none";
  quizAnswered = false;
  barFill.style.width = ((quizIndex) / total * 100) + "%";

  answers.innerHTML = "";
  q.a.forEach((ans, i) => {
    const btn = document.createElement("button");
    btn.className = "q-ans";
    btn.textContent = ans;
    btn.addEventListener("click", () => answer(i, btn));
    answers.appendChild(btn);
  });
}

function answer(i, btn) {
  if (quizAnswered) return;
  quizAnswered = true;
  const q = QUIZ[quizIndex];
  const feedback = document.getElementById("q-feedback");
  const answers = document.querySelectorAll(".q-ans");

  if (i === q.ok) {
    btn.classList.add("correct");
    // за правильный ответ — 5 минут премиума
    const reward = document.getElementById("q-reward");
    reward.style.display = "inline-block";
    const barFill = document.getElementById("q-bar-fill");
    barFill.style.width = ((quizIndex + 1) / QUIZ.length * 100) + "%";
  } else {
    btn.classList.add("wrong");
    answers[q.ok].classList.add("correct");
    feedback.innerHTML = "❌ Неверно. Правильный ответ выделен.";
    feedback.className = "q-feedback bad";
    const restart = document.getElementById("q-restart");
    restart.style.display = "inline-block";
  }
}

function grantTempPremium() {
  const fiveMin = 5 * 60 * 1000;
  localStorage.setItem(FORM_KEY, "unlocked");
  localStorage.setItem(FORM_EXPIRY_KEY, String(Date.now() + fiveMin));
  alert("🎉 5 минут бесплатного премиума активированы! Открываю вкладку Премиум…");
  // открыть вкладку премиума
  const bt = document.querySelector('[data-tab="premium"]');
  if (bt) bt.click();
}

function restartQuiz() {
  initQuiz();
}