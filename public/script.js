const joinBtn = document.getElementById("joinBtn");
const formSection = document.getElementById("formSection");
const applicationForm = document.getElementById("applicationForm");
const humanBtn = document.getElementById("humanBtn");
const checkText = document.getElementById("checkText");
const progressBar = document.getElementById("progressBar");
const submitBtn = document.getElementById("submitBtn");
const formMessage = document.getElementById("formMessage");
const successSection = document.getElementById("successSection");

joinBtn.addEventListener("click", () => {
  formSection.classList.remove("hidden");
  formSection.scrollIntoView({ behavior:"smooth", block:"start" });
});

humanBtn.addEventListener("click", async () => {
  if (humanBtn.disabled) return;
  humanBtn.disabled = true;
  checkText.textContent = "ИНИЦИАЛИЗАЦИЯ ПРОТОКОЛА...";
  progressBar.style.width = "0%";

  const messages = [
    "СИНХРОНИЗАЦИЯ...",
    "ПРОВЕРКА СИГНАЛА...",
    "АНАЛИЗ ПОВЕДЕНИЯ...",
    "ОБРАБОТКА...",
    "ПРОВЕРКА ЗАВЕРШЕНА."
  ];

  for(let i=0;i<messages.length;i++){
    await new Promise(r=>setTimeout(r, 350));
    checkText.textContent = messages[i];
    progressBar.style.width = `${(i+1)*20}%`;
  }

  humanBtn.classList.add("verified");
  humanBtn.textContent = "✓ ПРОВЕРКА ПРОЙДЕНА";
  submitBtn.disabled = false;
});

applicationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formMessage.textContent = "ПЕРЕДАЧА ДАННЫХ...";
  submitBtn.disabled = true;

  const data = Object.fromEntries(new FormData(applicationForm));
  data.humanCheck = true;

  try {
    const response = await fetch("/api/register", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(data)
    });
    const result = await response.json();

    if (!response.ok || !result.ok) throw new Error(result.message || "Ошибка");

    formSection.classList.add("hidden");
    successSection.classList.remove("hidden");
    successSection.scrollIntoView({behavior:"smooth"});
  } catch(error) {
    formMessage.textContent = "ОШИБКА: " + error.message;
    submitBtn.disabled = false;
  }
});