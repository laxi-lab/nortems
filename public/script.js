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
  lang: () => {
    const modal = document.getElementById("languageModal");
    if (modal) {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
    }
  },
  tiktok: () => {
    window.location.href = "https://www.tiktok.com/@sandoradosicry";
  },
  youtube: () => {
    window.location.href = "https://www.youtube.com/@San_Dorado";
  },
  discord: () => {
    window.open("https://discord.gg/DPHQTsq7E", "_blank", "noopener,noreferrer");
  },

  clock: () => showToast(new Date().toLocaleTimeString("ru-RU", {hour:"2-digit",minute:"2-digit"}) + " // LOCAL"),
  language: () => showToast("ЯЗЫК: RU // ПЕРЕКЛЮЧАТЕЛЬ СКОРО"),
  community: () => showToast("СООБЩЕСТВО // РАЗДЕЛ СКОРО"),
  notifications: () => showToast("УВЕДОМЛЕНИЯ // 0"),
  theme: () => {
    const themes = ["green", "cyan", "red", "yellow"];
    const labels = {
      green: "ЗЕЛЁНАЯ",
      cyan: "ГОЛУБАЯ",
      red: "КРАСНАЯ",
      yellow: "ЖЁЛТАЯ"
    };
    const current = themes.findIndex(t => document.body.classList.contains("theme-" + t));
    const next = themes[(current + 1) % themes.length];

    document.body.classList.remove("theme-green", "theme-cyan", "theme-red", "theme-yellow", "light-mode", "alt");
    document.body.classList.add("theme-" + next);
    showToast("ТЕМА: " + labels[next]);
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




/* V6 multilingual interface */
const NORTEMS_TRANSLATIONS = {'ru': {'company': 'Аут-Лайн', 'time': 'ВРЕМЯ', 'lang': 'ЯЗЫК', 'notify': 'СВЯЗЬ', 'theme': 'ТЕМА', 'tiktok': 'ТИКТОК', 'youtube': 'ЮТУБ', 'discord': 'ДИСКОРД', 'language_title': 'Выберите язык', 'language_kicker': 'ЯЗЫК / LANGUAGE', 'archive_kicker': 'АРХИВ / ИЗМЕНЕНИЯ', 'archive_title': 'История проекта', 'v1': 'Старая версия', 'v1p': 'Первый вариант Аут-Лайна — яркая рекламная эстетика, насыщенные цвета и крупная подача.', 'v2': 'Переход', 'v2p': 'Интерфейс был переведён в строгую ретро-компьютерную эстетику: CRT, терминальная графика и системные элементы.', 'v3': 'Новая версия', 'v3p': 'Добавлены боковая навигация, четыре цветовые темы, меню и базовые интерактивные функции.', 'english': 'English', 'chinese': '中文', 'russian': 'Русский', 'ukrainian': 'Українська', 'japanese': '日本語'}, 'en': {'company': 'Out-Line', 'time': 'TIME', 'lang': 'LANGUAGE', 'notify': 'CONTACT', 'theme': 'THEME', 'tiktok': 'TIKTOK', 'youtube': 'YOUTUBE', 'discord': 'DISCORD', 'language_title': 'Choose language', 'language_kicker': 'LANGUAGE', 'archive_kicker': 'ARCHIVE / CHANGES', 'archive_title': 'Project history', 'v1': 'Old version', 'v1p': 'The first version of Out-Line used a bright advertising aesthetic, saturated colors and an intentionally bold presentation.', 'v2': 'Transition', 'v2p': 'The interface was rebuilt around a strict retro-computer aesthetic: CRT, terminal graphics and system elements.', 'v3': 'New version', 'v3p': 'Side navigation, four color themes, the menu and basic interactive functions were added.', 'english': 'English', 'chinese': 'Chinese', 'russian': 'Russian', 'ukrainian': 'Ukrainian', 'japanese': 'Japanese'}, 'zh': {'company': '奥特莱恩', 'time': '时间', 'lang': '语言', 'notify': '联系', 'theme': '主题', 'tiktok': '抖音', 'youtube': '油管', 'discord': 'Discord', 'language_title': '选择语言', 'language_kicker': '语言', 'archive_kicker': '档案 / 变更', 'archive_title': '项目历史', 'v1': '旧版本', 'v1p': '奥特莱恩的第一个版本采用明亮的广告风格、鲜艳色彩和大胆的视觉呈现。', 'v2': '过渡版本', 'v2p': '界面转向严格的复古电脑美学：CRT、终端图形和系统元素。', 'v3': '新版本', 'v3p': '加入了侧边导航、四种主题、菜单以及基础交互功能。', 'english': '英语', 'chinese': '中文', 'russian': '俄语', 'ukrainian': '乌克兰语', 'japanese': '日语'}, 'uk': {'company': 'Аут-Лайн', 'time': 'ЧАС', 'lang': 'МОВА', 'notify': "ЗВ'ЯЗОК", 'theme': 'ТЕМА', 'tiktok': 'ТІКТОК', 'youtube': 'ЮТУБ', 'discord': 'ДІСКОРД', 'language_title': 'Оберіть мову', 'language_kicker': 'МОВА / LANGUAGE', 'archive_kicker': 'АРХІВ / ЗМІНИ', 'archive_title': 'Історія проєкту', 'v1': 'Стара версія', 'v1p': 'Перший варіант Аут-Лайну — яскрава рекламна естетика, насичені кольори та велика подача.', 'v2': 'Перехід', 'v2p': "Інтерфейс перевели у строгу ретро-комп'ютерну естетику: CRT, термінальна графіка та системні елементи.", 'v3': 'Нова версія', 'v3p': 'Додано бічну навігацію, чотири кольорові теми, меню та базові інтерактивні функції.', 'english': 'Англійська', 'chinese': 'Китайська', 'russian': 'Російська', 'ukrainian': 'Українська', 'japanese': 'Японська'}, 'ja': {'company': 'アウトライン', 'time': '時間', 'lang': '言語', 'notify': '連絡', 'theme': 'テーマ', 'tiktok': 'TikTok', 'youtube': 'YouTube', 'discord': 'Discord', 'language_title': '言語を選択', 'language_kicker': '言語 / LANGUAGE', 'archive_kicker': 'アーカイブ / 変更履歴', 'archive_title': 'プロジェクトの履歴', 'v1': '旧バージョン', 'v1p': 'アウトラインの最初のバージョンは、明るい広告的なデザインと鮮やかな色、大胆な表現を採用していました。', 'v2': '移行', 'v2p': 'インターフェースはCRT、ターミナルグラフィック、システム要素を中心とした厳格なレトロコンピューター風へ変更されました。', 'v3': '新バージョン', 'v3p': 'サイドナビゲーション、4つのカラーテーマ、メニュー、基本的なインタラクションを追加しました。', 'english': '英語', 'chinese': '中国語', 'russian': 'ロシア語', 'ukrainian': 'ウクライナ語', 'japanese': '日本語'}};
const NORTEMS_LANG_NAMES = {
  ru: "Русский", en: "English", zh: "中文", uk: "Українська", ja: "日本語"
};

function applyNortemsLanguage(lang) {
  const dict = NORTEMS_TRANSLATIONS[lang] || NORTEMS_TRANSLATIONS.ru;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  localStorage.setItem("nortems-language", lang);
  const title = document.querySelector("title");
  if (title) title.textContent = dict.company + " — " + (lang === "ru" ? "официальный сайт" : "official site");
}

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("nortems-language") || "ru";
  applyNortemsLanguage(saved);

  document.querySelectorAll(".language-options button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      if (!lang) return;
      applyNortemsLanguage(lang);
      const modal = document.getElementById("languageModal");
      if (modal) {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
      }
      if (typeof showToast === "function") {
        const dict = NORTEMS_TRANSLATIONS[lang];
        showToast((dict && dict.lang ? dict.lang : "LANGUAGE") + ": " + NORTEMS_LANG_NAMES[lang]);
      }
    });
  });
});
