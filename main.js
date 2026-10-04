// Премиум-доступ за "50 звёзд".
// Кнопка "Оплатить" ведёт на Telegram владельца @davny.
// После оплаты владелец выдаёт код из списка в codes.js.
// Ввод кода открывает премиум-раздел и запоминает доступ в браузере.

const FORM_KEY = "stars_premium_access";

document.addEventListener("DOMContentLoaded", () => {
  const locked = document.getElementById("locked");
  const content = document.getElementById("premium-content");

  if (localStorage.getItem(FORM_KEY) === "unlocked") {
    if (locked) locked.style.display = "none";
    if (content) content.style.display = "block";
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