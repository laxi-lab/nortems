const $ = (s) => document.querySelector(s);
const menuOverlay = $("#menuOverlay");
const menuTrigger = $("#menuTrigger");
const menuClose = $("#menuClose");
const toast = $("#toast");

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => toast.classList.remove("show"), 2400);
}

function openMenu(){ menuOverlay.classList.add("open"); }
function closeMenu(){ menuOverlay.classList.remove("open"); }

menuTrigger.addEventListener("click", openMenu);
menuClose.addEventListener("click", closeMenu);
menuOverlay.addEventListener("click", (e) => {
  if (e.target === menuOverlay) closeMenu();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

$("#homeBtn").addEventListener("click", () => {
  closeMenu();
  window.scrollTo({top:0, behavior:"smooth"});
});

document.querySelectorAll(".menu-item").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.section;
    closeMenu();
    if (id === "join") {
      $("#join").scrollIntoView({behavior:"smooth"});
      return;
    }
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({behavior:"smooth"});
    else showToast("РАЗДЕЛ ПОКА НЕ ГОТОВ // 84");
  });
});

$("#joinBtn").addEventListener("click", () => {
  $("#join").scrollIntoView({behavior:"smooth"});
});

document.querySelectorAll("[data-placeholder]").forEach(btn => {
  btn.addEventListener("click", () => showToast("ВХОД ПОКА ЗАКРЫТ // СКОРО"));
});

const actions = {
  clock: () => showToast(new Date().toLocaleTimeString("ru-RU", {hour:"2-digit",minute:"2-digit"}) + " // LOCAL"),
  language: () => showToast("ЯЗЫК: RU // ПЕРЕКЛЮЧАТЕЛЬ СКОРО"),
  community: () => showToast("СООБЩЕСТВО // РАЗДЕЛ СКОРО"),
  notifications: () => showToast("УВЕДОМЛЕНИЯ // 0"),
  theme: () => {
    document.body.classList.toggle("alt");
    showToast(document.body.classList.contains("alt") ? "THEME: ICE" : "THEME: TERMINAL");
  },
  tiktok: () => showToast("TIKTOK // ССЫЛКА СКОРО"),
  youtube: () => showToast("VIDEO // ССЫЛКА СКОРО"),
  discord: () => showToast("DISCORD // ССЫЛКА СКОРО")
};
document.querySelectorAll(".rail-btn").forEach(btn => {
  btn.addEventListener("click", () => actions[btn.dataset.action]?.());
});

const form = $("#applicationForm");
const humanBtn = $("#humanBtn");
const progress = $("#progressBar");
const checkText = $("#checkText");
const submitBtn = $("#submitBtn");
const formMessage = $("#formMessage");

humanBtn.addEventListener("click", async () => {
  humanBtn.disabled = true;
  const states = ["СВЯЗЬ...", "АНАЛИЗ...", "СИНХРОНИЗАЦИЯ...", "ПРОВЕРКА...", "OK // HUMAN"];
  for(let i=0;i<states.length;i++){
    await new Promise(r => setTimeout(r, 280));
    checkText.textContent = states[i];
    progress.style.width = `${(i+1)*20}%`;
  }
  submitBtn.disabled = false;
  humanBtn.textContent = "✓ ГОТОВО";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  formMessage.textContent = "ПЕРЕДАЧА ДАННЫХ...";
  const data = Object.fromEntries(new FormData(form));
  data.humanCheck = true;
  try {
    const response = await fetch("/api/register", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(data)
    });
    const result = await response.json();
    if(!response.ok || !result.ok) throw new Error(result.message || "Ошибка");
    form.reset();
    progress.style.width = "0%";
    checkText.textContent = "ПРОВЕРКА: НЕ БОТ";
    humanBtn.disabled = false;
    humanBtn.textContent = "ПРОВЕРИТЬ";
    formMessage.textContent = "ЗАЯВКА ПРИНЯТА // КАНАЛ ЗАКРЫТ";
  } catch(err) {
    formMessage.textContent = "ОШИБКА: " + err.message;
    submitBtn.disabled = false;
  }
});
