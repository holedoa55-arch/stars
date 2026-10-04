// Премиум-доступ за "50 звёзд".
// Кнопка "Оплатить" ведёт на Telegram владельца @davny.
// После оплаты владелец выдаёт код из списка в codes.js.
// Ввод кода открывает премиум-раздел и запоминает доступ в браузере.

const FORM_KEY = "stars_premium_access";

document.addEventListener("DOMContentLoaded", () => {
  const locked = document.getElementById("locked");
  const content = document.getElementById("premium-content");

  const hasAccess = localStorage.getItem(FORM_KEY) === "unlocked";

  // Вкладки
  const tabButtons = document.querySelectorAll(".tab");
  const goto = (name) => {
    tabButtons.forEach(b => b.classList.toggle("active", b.dataset.tab === name));
    document.querySelectorAll(".tab-page").forEach(p => p.classList.toggle("active", p.id === "page-" + name));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  tabButtons.forEach(b => b.addEventListener("click", () => goto(b.dataset.tab)));

  // Плавное появление при прокрутке
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".fade").forEach(el => io.observe(el));
  } else {
    document.querySelectorAll(".fade").forEach(el => el.classList.add("in"));
  }

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