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
    window.location.assign("https://www.tiktok.com/@sandoradosicry?is_from_webapp=1&sender_device=pc");
  },
  youtube: () => {
    window.location.assign("https://youtube.com/@san_dorado?si=Qrs60_-WS4MI87np");
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






/* V7 — complete interface translation */
const NORTEMS_I18N = {"ru": {"company": "Аут-Лайн", "official": "официальный сайт", "time": "ВРЕМЯ", "lang": "ЯЗЫК", "notify": "СВЯЗЬ", "theme": "ТЕМА", "tiktok": "ТИКТОК", "youtube": "ЮТУБ", "discord": "ДИСКОРД", "people": "ЛЮДИ", "menu": "МЕНЮ", "close": "ЗАКРЫТЬ", "language_title": "Выберите язык", "language_kicker": "ЯЗЫК / LANGUAGE", "english": "Английский", "chinese": "Китайский", "russian": "Русский", "ukrainian": "Украинский", "japanese": "Японский", "archive_kicker": "АРХИВ / ИЗМЕНЕНИЯ", "archive_title": "История проекта", "v1": "Старая версия", "v1p": "Первый вариант Аут-Лайна — яркая рекламная эстетика, насыщенные цвета и крупная подача.", "v2": "Переход", "v2p": "Интерфейс был переведён в строгую ретро-компьютерную эстетику: CRT, терминальная графика и системные элементы.", "v3": "Новая версия", "v3p": "Добавлены боковая навигация, четыре цветовые темы, меню и базовые интерактивные функции.", "join": "ПРИСОЕДИНИТЬСЯ", "about_title": "Аут-Лайн", "about": "Аут-Лайн — это пространство для людей, которые хотят быть частью чего-то большего.", "registration": "Регистрация", "name": "Имя", "address": "Как к вам обращаться", "purpose": "Цель подачи анкеты", "story": "Рассказ о себе", "email": "Электронная почта", "submit": "Отправить заявку", "confirm": "Подтвердить", "notbot": "Я не бот", "enter": "Войти", "success": "Заявка отправлена", "error": "Не удалось отправить заявку", "select": "Выберите вариант", "theme_green": "ЗЕЛЁНАЯ", "theme_cyan": "ГОЛУБАЯ", "theme_red": "КРАСНАЯ", "theme_yellow": "ЖЁЛТАЯ", "theme_msg": "ТЕМА", "contact": "Связь", "back": "Назад"}, "en": {"company": "Out-Line", "official": "official site", "time": "TIME", "lang": "LANGUAGE", "notify": "CONTACT", "theme": "THEME", "tiktok": "TIKTOK", "youtube": "YOUTUBE", "discord": "DISCORD", "people": "PEOPLE", "menu": "MENU", "close": "CLOSE", "language_title": "Choose language", "language_kicker": "LANGUAGE", "english": "English", "chinese": "Chinese", "russian": "Russian", "ukrainian": "Ukrainian", "japanese": "Japanese", "archive_kicker": "ARCHIVE / CHANGES", "archive_title": "Project history", "v1": "Old version", "v1p": "The first version of Out-Line used a bright advertising aesthetic, saturated colors and a bold presentation.", "v2": "Transition", "v2p": "The interface was rebuilt around a strict retro-computer aesthetic: CRT, terminal graphics and system elements.", "v3": "New version", "v3p": "Side navigation, four color themes, the menu and basic interactive functions were added.", "join": "JOIN", "about_title": "Out-Line", "about": "Out-Line is a space for people who want to be part of something bigger.", "registration": "Registration", "name": "Name", "address": "How should we address you", "purpose": "Purpose of your application", "story": "Tell us about yourself", "email": "Email", "submit": "Submit application", "confirm": "Confirm", "notbot": "I am not a bot", "enter": "Log in", "success": "Application sent", "error": "Failed to send application", "select": "Choose an option", "theme_green": "GREEN", "theme_cyan": "CYAN", "theme_red": "RED", "theme_yellow": "YELLOW", "theme_msg": "THEME", "contact": "Contact", "back": "Back"}, "zh": {"company": "奥特莱恩", "official": "官方网站", "time": "时间", "lang": "语言", "notify": "联系", "theme": "主题", "tiktok": "抖音", "youtube": "油管", "discord": "Discord", "people": "成员", "menu": "菜单", "close": "关闭", "language_title": "选择语言", "language_kicker": "语言", "english": "英语", "chinese": "中文", "russian": "俄语", "ukrainian": "乌克兰语", "japanese": "日语", "archive_kicker": "档案 / 变更", "archive_title": "项目历史", "v1": "旧版本", "v1p": "奥特莱恩的第一个版本采用明亮的广告风格、鲜艳色彩和大胆的视觉呈现。", "v2": "过渡", "v2p": "界面转向严格的复古电脑美学：CRT、终端图形和系统元素。", "v3": "新版本", "v3p": "加入了侧边导航、四种主题、菜单以及基础交互功能。", "join": "加入", "about_title": "奥特莱恩", "about": "奥特莱恩是一个让人们成为更大事物一部分的空间。", "registration": "注册", "name": "姓名", "address": "如何称呼您", "purpose": "申请目的", "story": "自我介绍", "email": "电子邮箱", "submit": "提交申请", "confirm": "确认", "notbot": "我不是机器人", "enter": "登录", "success": "申请已发送", "error": "申请发送失败", "select": "请选择", "theme_green": "绿色", "theme_cyan": "青色", "theme_red": "红色", "theme_yellow": "黄色", "theme_msg": "主题", "contact": "联系", "back": "返回"}, "uk": {"company": "Аут-Лайн", "official": "офіційний сайт", "time": "ЧАС", "lang": "МОВА", "notify": "ЗВ'ЯЗОК", "theme": "ТЕМА", "tiktok": "ТІКТОК", "youtube": "ЮТУБ", "discord": "ДІСКОРД", "people": "ЛЮДИ", "menu": "МЕНЮ", "close": "ЗАКРИТИ", "language_title": "Оберіть мову", "language_kicker": "МОВА / LANGUAGE", "english": "Англійська", "chinese": "Китайська", "russian": "Російська", "ukrainian": "Українська", "japanese": "Японська", "archive_kicker": "АРХІВ / ЗМІНИ", "archive_title": "Історія проєкту", "v1": "Стара версія", "v1p": "Перший варіант Аут-Лайну — яскрава рекламна естетика, насичені кольори та велика подача.", "v2": "Перехід", "v2p": "Інтерфейс перевели у строгу ретро-комп'ютерну естетику: CRT, термінальна графіка та системні елементи.", "v3": "Нова версія", "v3p": "Додано бічну навігацію, чотири кольорові теми, меню та базові інтерактивні функції.", "join": "ПРИЄДНАТИСЯ", "about_title": "Аут-Лайн", "about": "Аут-Лайн — це простір для людей, які хочуть бути частиною чогось більшого.", "registration": "Реєстрація", "name": "Ім'я", "address": "Як до вас звертатися", "purpose": "Мета подання анкети", "story": "Розкажіть про себе", "email": "Електронна пошта", "submit": "Надіслати заявку", "confirm": "Підтвердити", "notbot": "Я не бот", "enter": "Увійти", "success": "Заявку надіслано", "error": "Не вдалося надіслати заявку", "select": "Оберіть варіант", "theme_green": "ЗЕЛЕНА", "theme_cyan": "БЛАКИТНА", "theme_red": "ЧЕРВОНА", "theme_yellow": "ЖОВТА", "theme_msg": "ТЕМА", "contact": "Зв'язок", "back": "Назад"}, "ja": {"company": "アウトライン", "official": "公式サイト", "time": "時間", "lang": "言語", "notify": "連絡", "theme": "テーマ", "tiktok": "TikTok", "youtube": "YouTube", "discord": "Discord", "people": "メンバー", "menu": "メニュー", "close": "閉じる", "language_title": "言語を選択", "language_kicker": "言語 / LANGUAGE", "english": "英語", "chinese": "中国語", "russian": "ロシア語", "ukrainian": "ウクライナ語", "japanese": "日本語", "archive_kicker": "アーカイブ / 変更履歴", "archive_title": "プロジェクトの履歴", "v1": "旧バージョン", "v1p": "アウトラインの最初のバージョンは、明るい広告的なデザインと鮮やかな色、大胆な表現を採用していました。", "v2": "移行", "v2p": "インターフェースはCRT、ターミナルグラフィック、システム要素を中心とした厳格なレトロコンピューター風へ変更されました。", "v3": "新バージョン", "v3p": "サイドナビゲーション、4つのカラーテーマ、メニュー、基本的なインタラクションを追加しました。", "join": "参加する", "about_title": "アウトライン", "about": "アウトラインは、より大きな何かの一部になりたい人のための空間です。", "registration": "登録", "name": "名前", "address": "呼び方", "purpose": "応募の目的", "story": "自己紹介", "email": "メールアドレス", "submit": "申請を送信", "confirm": "確認", "notbot": "私はボットではありません", "enter": "ログイン", "success": "申請を送信しました", "error": "申請を送信できませんでした", "select": "選択してください", "theme_green": "緑", "theme_cyan": "シアン", "theme_red": "赤", "theme_yellow": "黄色", "theme_msg": "テーマ", "contact": "連絡", "back": "戻る"}};
const NORTEMS_LANG_NAMES = {ru:"Русский",en:"English",zh:"中文",uk:"Українська",ja:"日本語"};

const NORTEMS_TEXT_MAP = {
  "ПРИСОЕДИНИТЬСЯ":"join","Аут-Лайн":"company","официальный сайт":"official",
  "ВРЕМЯ":"time","ЯЗЫК":"lang","СВЯЗЬ":"notify","ТЕМА":"theme","ТИКТОК":"tiktok","ЮТУБ":"youtube","ДИСКОРД":"discord",
  "АРХИВ / ИЗМЕНЕНИЯ":"archive_kicker","История проекта":"archive_title","Старая версия":"v1","Переход":"v2","Новая версия":"v3",
  "Первый вариант Аут-Лайна — яркая рекламная эстетика, насыщенные цвета и крупная подача.":"v1p",
  "Интерфейс был переведён в строгую ретро-компьютерную эстетику: CRT, терминальная графика и системные элементы.":"v2p",
  "Добавлены боковая навигация, четыре цветовые темы, меню и базовые интерактивные функции.":"v3p",
  "Выберите язык":"language_title","ЯЗЫК / LANGUAGE":"language_kicker",
  "Английский":"english","Китайский":"chinese","Русский":"russian","Украинский":"ukrainian","Японский":"japanese",
  "Регистрация":"registration","Имя":"name","Как к вам обращаться":"address","Цель подачи анкеты":"purpose",
  "Рассказ о себе":"story","Электронная почта":"email","Отправить заявку":"submit","Подтвердить":"confirm",
  "Я не бот":"notbot","Войти":"enter"
};

function translateAllTextNodes(lang) {
  const dict = NORTEMS_I18N[lang] || NORTEMS_I18N.ru;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.nodeValue.trim()) continue;
    const parent = node.parentElement;
    if (!parent || ["SCRIPT","STYLE"].includes(parent.tagName)) continue;
    nodes.push(node);
  }
  nodes.forEach(node => {
    const raw = node.nodeValue;
    const trimmed = raw.trim();
    const key = NORTEMS_TEXT_MAP[trimmed];
    if (key && dict[key] !== undefined) {
      node.nodeValue = raw.replace(trimmed, dict[key]);
    }
  });

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (dict[key] !== undefined) el.placeholder = dict[key];
  });

  document.documentElement.lang = lang;
  localStorage.setItem("nortems-language", lang);
}

function setNortemsLanguage(lang) {
  /*
   * Restore the original language before translating again.
   * This avoids English -> Russian -> Japanese chains.
   */
  location.reload();
  localStorage.setItem("nortems-language", lang);
}

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("nortems-language") || "ru";
  translateAllTextNodes(saved);

  const modal = document.getElementById("languageModal");
  document.querySelectorAll(".language-options button").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      if (!lang) return;
      localStorage.setItem("nortems-language", lang);
      window.location.reload();
    });
  });
});
