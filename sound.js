// Звук при открытии сайта.
// Браузеры блокируют автозапуск аудио без действия пользователя,
// поэтому звук играет при первом клике/нажатии на страницу.
// Web Audio API — без внешних файлов. Есть кнопка вкл/выкл.

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

  function playStart() {
    if (!enabled) return;
    var c = audio();
    if (!c) return;
    if (c.state === "suspended") c.resume();
    var t = c.currentTime;

    // низкий "космический" аккорд-удар
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(196, t);          // G3
    osc.frequency.exponentialRampToValueAtTime(392, t + 0.4); // G4
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.18, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
    osc.connect(gain).connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.85);

    // высокий "искрящийся" колокольчик
    var osc2 = c.createOscillator();
    var gain2 = c.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, t + 0.05);  // A5
    gain2.gain.setValueAtTime(0.0001, t + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.08, t + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    osc2.connect(gain2).connect(c.destination);
    osc2.start(t + 0.05);
    osc2.stop(t + 0.65);
  }

  function playToggle(on) {
    if (!on) return;
    var c = audio();
    if (!c) return;
    if (c.state === "suspended") c.resume();
    var t = c.currentTime;
    var o = c.createOscillator();
    var g = c.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(on ? 600 : 300, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.1, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + 0.3);
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
    btn.addEventListener("click", function () {
      enabled = !enabled;
      localStorage.setItem("stars_sound", enabled ? "on" : "off");
      btn.textContent = enabled ? "🔊" : "🔇";
      playToggle(enabled);
    });
    document.body.appendChild(btn);
  }

  function init() {
    // первый клик/нажатие на страницу запускает звук открытия
    var started = false;
    function fire() {
      if (started) return;
      started = true;
      playStart();
      window.removeEventListener("pointerdown", fire);
      window.removeEventListener("keydown", fire);
    }
    window.addEventListener("pointerdown", fire);
    window.addEventListener("keydown", fire);
    makeToggle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();