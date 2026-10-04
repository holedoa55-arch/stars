// Мягкий тихий спокойный звук при каждом клике по сайту.
// Синтезируется через Web Audio API — без внешних файлов.
// Браузеры требуют первого действия пользователя для включения аудио.
// Есть кнопка вкл/выкл (внизу справа).

(function () {
  var ctx = null;
  var enabled = localStorage.getItem("stars_sound") !== "off";

  function audio() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    return ctx;
  }

  // Мягкий тихий "клик" — короткий приглушённый тон низкой громкости
  function playClick() {
    if (!enabled) return;
    var c = audio();
    if (!c) return;
    if (c.state === "suspended") c.resume();
    var t = c.currentTime;

    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(660, t);
    osc.frequency.exponentialRampToValueAtTime(330, t + 0.09);

    // очень тихо
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.05, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

    osc.connect(gain).connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.14);
  }

  // короткий звук когда звук включают/выключают
  function playToggle(on) {
    var c = audio();
    if (!c) return;
    if (c.state === "suspended") c.resume();
    var t = c.currentTime;
    var o = c.createOscillator();
    var g = c.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(on ? 520 : 260, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.06, t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + 0.22);
  }

  // Кнопка вкл/выкл
  function makeToggle() {
    var btn = document.createElement("button");
    btn.id = "sound-toggle";
    btn.setAttribute("aria-label", "Звук");
    btn.textContent = enabled ? "🔊" : "🔇";
    btn.style.cssText =
      "position:fixed;bottom:18px;right:18px;z-index:99;width:48px;height:48px;" +
      "border-radius:50%;border:1px solid #00e5ff;background:rgba(14,17,32,0.85);" +
      "color:#00e5ff;font-size:20px;cursor:pointer;box-shadow:0 4px 20px rgba(0,229,255,0.3);";
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      enabled = !enabled;
      localStorage.setItem("stars_sound", enabled ? "on" : "off");
      btn.textContent = enabled ? "🔊" : "🔇";
      playToggle(enabled);
    });
    document.body.appendChild(btn);
  }

  function init() {
    // тихий клик на каждый клик по странице (кроме кнопки звука)
    document.addEventListener("click", function (e) {
      if (e.target && e.target.closest && e.target.closest("#sound-toggle")) return;
      playClick();
    }, true);
    makeToggle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();