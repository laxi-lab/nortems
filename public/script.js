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
    window.location.href = "https://www.tiktok.com/@sandoradosicry?is_from_webapp=1&sender_device=pc";
  },
  youtube: () => {
    window.location.href = "https://youtube.com/@san_dorado?si=Qrs60_-WS4MI87np";
  },
  discord: () => {
    window.open("https://discord.gg/DPHQTsq7E", "_blank", "noopener,noreferrer");
  },
  time: () => {
    const lang = localStorage.getItem("nortems-language") || "ru";
    const locale = {ru:"ru-RU",en:"en-US",zh:"zh-CN",uk:"uk-UA",ja:"ja-JP"}[lang] || "ru-RU";
    showToast(new Date().toLocaleTimeString(locale, {hour:"2-digit",minute:"2-digit"}) + " // " + (NORTEMS_I18N[lang]?.time || "TIME"));
  },
  notify: () => {
    const lang = localStorage.getItem("nortems-language") || "ru";
    showToast(NORTEMS_I18N[lang]?.contact || "CONTACT");
  },
  theme: () => {
    const themes = ["green","cyan","red","yellow"];
    const labels = {green:"theme_green",cyan:"theme_cyan",red:"theme_red",yellow:"theme_yellow"};
    const current = themes.findIndex(t => document.body.classList.contains("theme-" + t));
    const next = themes[(current + 1) % themes.length];
    document.body.classList.remove("theme-green","theme-cyan","theme-red","theme-yellow","light-mode","alt");
    document.body.classList.add("theme-" + next);
    const lang = localStorage.getItem("nortems-language") || "ru";
    showToast((NORTEMS_I18N[lang]?.theme_msg || "THEME") + ": " + (NORTEMS_I18N[lang]?.[labels[next]] || next.toUpperCase()));
  }
};
document.querySelectorAll(".rail-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    if (actions[action]) actions[action]();
  });
});

const form = $("#applicationForm");
const humanBtn = $("#humanBtn");
const progress = $("#progressBar");
const checkText = $("#checkText");
const submitBtn = $("#submitBtn");
const formMessage = $("#formMessage");

humanBtn.addEventListener("click", async () => {
  humanBtn.disabled = true;
  const states = (NORTEMS_I18N[localStorage.getItem("nortems-language") || "ru"]?.human_states || "CONNECTING...|ANALYZING...|SYNCHRONIZING...|VERIFYING...|OK // HUMAN").split("|");
  for(let i=0;i<states.length;i++){
    await new Promise(r => setTimeout(r, 280));
    checkText.textContent = states[i];
    progress.style.width = `${(i+1)*20}%`;
  }
  submitBtn.disabled = false;
  humanBtn.textContent = NORTEMS_I18N[localStorage.getItem("nortems-language") || "ru"]?.human_ready || "✓ READY";
});


form.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  const lang = localStorage.getItem("nortems-language") || "ru";
  formMessage.textContent = NORTEMS_I18N[lang]?.transmitting || "TRANSMITTING DATA...";
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
    checkText.textContent = NORTEMS_I18N[lang]?.human_reset_text || "BOT CHECK";
    humanBtn.disabled = false;
    humanBtn.textContent = NORTEMS_I18N[lang]?.human_reset || "VERIFY";
    formMessage.textContent = "";

    const successModal = document.getElementById("successModal");
    if (successModal) {
      successModal.classList.add("open");
      successModal.setAttribute("aria-hidden", "false");
    }
  } catch(err) {
    const prefix = NORTEMS_I18N[lang]?.error_prefix || "ERROR: ";
    formMessage.textContent = prefix + err.message;
    submitBtn.disabled = false;
  }
});








/* V8 — stable complete translation system */
const NORTEMS_I18N = {"ru": {"brand": "NORTEMS", "network": "NETWORK // 84", "sys": "SYS.84", "online": "ONLINE", "time": "ВРЕМЯ", "language": "ЯЗЫК", "contact": "СВЯЗЬ", "theme": "ТЕМА", "tiktok": "ТИКТОК", "youtube": "ЮТУБ", "discord": "ДИСКОРД", "main_menu": "ГЛАВНОЕ МЕНЮ", "home": "ГЛАВНАЯ", "about_nav": "О NORTEMS", "people_nav": "УЧАСТНИКИ", "archive_nav": "АРХИВ", "join_nav": "ПРИСОЕДИНИТЬСЯ", "about_en": "ОПИСАНИЕ", "people_en": "ЛЮДИ", "archive_en": "АРХИВ", "join_en": "ПРИСОЕДИНИТЬСЯ", "channel_status": "КАНАЛ: NORTEMS / СТАТУС: ОТКРЫТ", "connection": "> СОЕДИНЕНИЕ УСТАНОВЛЕНО_", "welcome": "> ДОБРО ПОЖАЛОВАТЬ, ПОСЕТИТЕЛЬ.", "first_visit": "[ ЗАКРЫТАЯ СЕТЬ // ПЕРВОЕ ПОСЕЩЕНИЕ ]", "company": "Аут-Лайн", "hero": "Это место ещё не успело решить, кем ты должен быть. Поэтому здесь можно просто остановиться, посмотреть вокруг и понять, хочешь ли ты остаться.", "join": "ПРИСОЕДИНИТЬСЯ", "login": "ВОЙТИ", "no_ads": "БЕЗ РЕКЛАМЫ", "no_feed": "БЕЗ ЛЕНТЫ", "no_algorithm": "БЕЗ АЛГОРИТМА", "search": "ПОИСК / 1984", "search_data": "ДАННЫЕ ПОИСКА", "channel": "КАНАЛ", "status": "СТАТУС", "open": "ОТКРЫТ", "visitors": "ПОСЕТИТЕЛИ", "description_index": "01 / ОПИСАНИЕ", "description_title": "ОПИСАНИЕ", "desc1": "NORTEMS — это не попытка сделать ещё одну страницу, которую пролистывают между двумя уведомлениями. Это небольшое цифровое пространство для людей, которым интересно находить странное, создавать своё и разговаривать не только о том, что уже стало популярным.", "desc2": "Здесь нет необходимости выглядеть определённым образом. Не нужно подбирать правильный ответ или доказывать, что ты достаточно интересный. Можно прийти с идеей, с историей, с проектом или просто с любопытством.", "quote1": "«СНАЧАЛА ПОСМОТРИ.", "quote2": "ПОТОМ РЕШИ, ОСТАВАТЬСЯ ЛИ.»", "people_index": "02 / ЛЮДИ", "people_title": "ЛЮДИ", "soon": "СКОРО.", "people_desc": "Раздел пока закрыт. Здесь появятся участники сети.", "archive_kicker": "АРХИВ / ИЗМЕНЕНИЯ", "archive_title": "История проекта", "v1": "Старая версия", "v1p": "Первый вариант Аут-Лайна — яркая рекламная эстетика, насыщенные цвета и крупная подача.", "v2": "Переход", "v2p": "Интерфейс был переведён в строгую ретро-компьютерную эстетику: CRT, терминальная графика и системные элементы.", "v3": "Новая версия", "v3p": "Добавлены боковая навигация, четыре цветовые темы, меню и базовые интерактивные функции.", "app_index": "04 / АНКЕТА", "app_title1": "ХОЧЕШЬ", "app_title2": "ВОЙТИ?", "app_desc": "Заполни короткую анкету. Никаких публичных профилей без твоего согласия.", "name": "ИМЯ", "address": "КАК К ТЕБЕ ОБРАЩАТЬСЯ", "email": "EMAIL", "purpose": "ЦЕЛЬ", "story": "О СЕБЕ", "human": "ПРОВЕРКА: НЕ БОТ", "check": "ПРОВЕРИТЬ", "submit": "ОТПРАВИТЬ ЗАЯВКУ →", "name_ph": "Имя", "address_ph": "Имя / ник", "email_ph": "you@example.com", "purpose_ph": "Зачем подаёшь заявку?", "story_ph": "Расскажи немного о себе", "language_kicker": "ЯЗЫК / LANGUAGE", "language_title": "Выберите язык", "english": "Английский", "chinese": "Китайский", "russian": "Русский", "ukrainian": "Украинский", "japanese": "Японский", "close": "ЗАКРЫТЬ", "menu_open": "Открыть главное меню", "menu_title": "Открыть меню", "transmitting": "ПЕРЕДАЧА ДАННЫХ...", "human_states": "СВЯЗЬ...|АНАЛИЗ...|СИНХРОНИЗАЦИЯ...|ПРОВЕРКА...|OK // ЧЕЛОВЕК", "human_ready": "✓ ГОТОВО", "human_reset": "ПРОВЕРИТЬ", "human_reset_text": "ПРОВЕРКА: НЕ БОТ", "success_kicker": "ПЕРЕДАЧА ЗАВЕРШЕНА", "success_title1": "ЗАЯВКА", "success_title2": "ПРИНЯТА.", "success_desc": "Система получила твою анкету. Теперь остаётся ждать ответа. Первый шаг сделан.", "success_back": "ВЕРНУТЬСЯ", "error_prefix": "ОШИБКА: ", "channel_closed": "ЗАЯВКА ПРИНЯТА // КАНАЛ ЗАКРЫТ", "theme_green": "ЗЕЛЁНАЯ", "theme_cyan": "ГОЛУБАЯ", "theme_red": "КРАСНАЯ", "theme_yellow": "ЖЁЛТАЯ", "theme_msg": "ТЕМА"}, "en": {"brand": "NORTEMS", "network": "NETWORK // 84", "sys": "SYS.84", "online": "ONLINE", "time": "TIME", "language": "LANGUAGE", "contact": "CONTACT", "theme": "THEME", "tiktok": "TIKTOK", "youtube": "YOUTUBE", "discord": "DISCORD", "main_menu": "MAIN MENU", "home": "HOME", "about_nav": "ABOUT NORTEMS", "people_nav": "PEOPLE", "archive_nav": "ARCHIVE", "join_nav": "JOIN", "about_en": "DESCRIPTION", "people_en": "PEOPLE", "archive_en": "ARCHIVE", "join_en": "JOIN", "channel_status": "CHANNEL: NORTEMS / STATUS: OPEN", "connection": "> CONNECTION ESTABLISHED_", "welcome": "> WELCOME, VISITOR.", "first_visit": "[ PRIVATE NETWORK // FIRST VISIT ]", "company": "Out-Line", "hero": "This place has not decided who you are supposed to be. So you can simply stop, look around, and decide whether you want to stay.", "join": "JOIN", "login": "LOG IN", "no_ads": "NO ADS", "no_feed": "NO FEED", "no_algorithm": "NO ALGORITHM", "search": "SEARCH / 1984", "search_data": "SEARCH DATA", "channel": "CHANNEL", "status": "STATUS", "open": "OPEN", "visitors": "VISITORS", "description_index": "01 / DESCRIPTION", "description_title": "DESCRIPTION", "desc1": "NORTEMS is not an attempt to make another page that gets scrolled past between two notifications. It is a small digital space for people who enjoy finding the strange, creating their own things, and talking about more than what is already popular.", "desc2": "There is no need to look a certain way here. You do not have to choose the right answer or prove that you are interesting enough. You can arrive with an idea, a story, a project, or simple curiosity.", "quote1": "“LOOK FIRST.", "quote2": "THEN DECIDE WHETHER TO STAY.”", "people_index": "02 / PEOPLE", "people_title": "PEOPLE", "soon": "COMING SOON.", "people_desc": "This section is currently closed. Network members will appear here.", "archive_kicker": "ARCHIVE / CHANGES", "archive_title": "Project history", "v1": "Old version", "v1p": "The first version of Out-Line used a bright advertising aesthetic, saturated colors and a bold presentation.", "v2": "Transition", "v2p": "The interface was rebuilt around a strict retro-computer aesthetic: CRT, terminal graphics and system elements.", "v3": "New version", "v3p": "Side navigation, four color themes, the menu and basic interactive functions were added.", "app_index": "04 / APPLICATION", "app_title1": "WANT TO", "app_title2": "JOIN?", "app_desc": "Fill out a short application. No public profiles without your consent.", "name": "NAME", "address": "HOW SHOULD WE ADDRESS YOU", "email": "EMAIL", "purpose": "PURPOSE", "story": "ABOUT YOU", "human": "BOT CHECK", "check": "VERIFY", "submit": "SUBMIT APPLICATION →", "name_ph": "Name", "address_ph": "Name / nickname", "email_ph": "you@example.com", "purpose_ph": "Why are you applying?", "story_ph": "Tell us a little about yourself", "language_kicker": "LANGUAGE", "language_title": "Choose language", "english": "English", "chinese": "Chinese", "russian": "Russian", "ukrainian": "Ukrainian", "japanese": "Japanese", "close": "CLOSE", "menu_open": "Open main menu", "menu_title": "Open menu", "transmitting": "TRANSMITTING DATA...", "human_states": "CONNECTING...|ANALYZING...|SYNCHRONIZING...|VERIFYING...|OK // HUMAN", "human_ready": "✓ READY", "human_reset": "VERIFY", "human_reset_text": "BOT CHECK", "success_kicker": "TRANSMISSION COMPLETE", "success_title1": "APPLICATION", "success_title2": "ACCEPTED.", "success_desc": "The system received your application. Now all that remains is to wait for a response. The first step is done.", "success_back": "RETURN", "error_prefix": "ERROR: ", "channel_closed": "APPLICATION ACCEPTED // CHANNEL CLOSED", "theme_green": "GREEN", "theme_cyan": "CYAN", "theme_red": "RED", "theme_yellow": "YELLOW", "theme_msg": "THEME"}, "zh": {"brand": "NORTEMS", "network": "网络 // 84", "sys": "系统.84", "online": "在线", "time": "时间", "language": "语言", "contact": "联系", "theme": "主题", "tiktok": "抖音", "youtube": "油管", "discord": "Discord", "main_menu": "主菜单", "home": "主页", "about_nav": "关于 NORTEMS", "people_nav": "成员", "archive_nav": "档案", "join_nav": "加入", "about_en": "介绍", "people_en": "成员", "archive_en": "档案", "join_en": "加入", "channel_status": "频道：NORTEMS / 状态：开放", "connection": "> 连接已建立_", "welcome": "> 欢迎，访客。", "first_visit": "[ 私人网络 // 首次访问 ]", "company": "奥特莱恩", "hero": "这里还没有决定你应该成为谁。所以，你可以停下来看看，然后决定自己是否想留下。", "join": "加入", "login": "登录", "no_ads": "无广告", "no_feed": "无信息流", "no_algorithm": "无算法", "search": "搜索 / 1984", "search_data": "搜索数据", "channel": "频道", "status": "状态", "open": "开放", "visitors": "访客", "description_index": "01 / 介绍", "description_title": "介绍", "desc1": "NORTEMS 不是又一个让人夹在通知之间随手划过的页面。这里是一个小型数字空间，属于喜欢发现奇怪事物、创造自己的东西，并讨论流行之外内容的人。", "desc2": "在这里，你不需要以某种固定的方式出现。不必寻找所谓正确答案，也不必证明自己足够有趣。你可以带着想法、故事、项目，或者单纯的好奇心来到这里。", "quote1": "“先看看。", "quote2": "再决定是否留下。”", "people_index": "02 / 成员", "people_title": "成员", "soon": "即将开放。", "people_desc": "此区域暂时关闭。网络成员将在这里出现。", "archive_kicker": "档案 / 变更", "archive_title": "项目历史", "v1": "旧版本", "v1p": "奥特莱恩的第一个版本采用明亮的广告风格、鲜艳色彩和大胆的视觉呈现。", "v2": "过渡", "v2p": "界面转向严格的复古电脑美学：CRT、终端图形和系统元素。", "v3": "新版本", "v3p": "加入了侧边导航、四种主题、菜单以及基础交互功能。", "app_index": "04 / 申请", "app_title1": "想要", "app_title2": "加入吗？", "app_desc": "填写一份简短申请。未经你的同意，不会创建公开资料。", "name": "姓名", "address": "如何称呼您", "email": "电子邮箱", "purpose": "目的", "story": "关于你", "human": "机器人检查", "check": "验证", "submit": "提交申请 →", "name_ph": "姓名", "address_ph": "姓名 / 昵称", "email_ph": "you@example.com", "purpose_ph": "为什么提交申请？", "story_ph": "简单介绍一下自己", "language_kicker": "语言", "language_title": "选择语言", "english": "英语", "chinese": "中文", "russian": "俄语", "ukrainian": "乌克兰语", "japanese": "日语", "close": "关闭", "menu_open": "打开主菜单", "menu_title": "打开菜单", "transmitting": "正在传输数据...", "human_states": "连接中...|分析中...|同步中...|验证中...|OK // 真人", "human_ready": "✓ 完成", "human_reset": "验证", "human_reset_text": "机器人检查", "success_kicker": "传输完成", "success_title1": "申请", "success_title2": "已接受。", "success_desc": "系统已经收到你的申请。现在只需等待回复。第一步已经完成。", "success_back": "返回", "error_prefix": "错误：", "channel_closed": "申请已接受 // 通道关闭", "theme_green": "绿色", "theme_cyan": "青色", "theme_red": "红色", "theme_yellow": "黄色", "theme_msg": "主题"}, "uk": {"brand": "NORTEMS", "network": "МЕРЕЖА // 84", "sys": "СИСТЕМА.84", "online": "ОНЛАЙН", "time": "ЧАС", "language": "МОВА", "contact": "ЗВ'ЯЗОК", "theme": "ТЕМА", "tiktok": "ТІКТОК", "youtube": "ЮТУБ", "discord": "ДІСКОРД", "main_menu": "ГОЛОВНЕ МЕНЮ", "home": "ГОЛОВНА", "about_nav": "ПРО NORTEMS", "people_nav": "УЧАСНИКИ", "archive_nav": "АРХІВ", "join_nav": "ПРИЄДНАТИСЯ", "about_en": "ОПИС", "people_en": "УЧАСНИКИ", "archive_en": "АРХІВ", "join_en": "ПРИЄДНАТИСЯ", "channel_status": "КАНАЛ: NORTEMS / СТАТУС: ВІДКРИТО", "connection": "> З'ЄДНАННЯ ВСТАНОВЛЕНО_", "welcome": "> ВІТАЄМО, ВІДВІДУВАЧУ.", "first_visit": "[ ЗАКРИТА МЕРЕЖА // ПЕРШЕ ВІДВІДУВАННЯ ]", "company": "Аут-Лайн", "hero": "Це місце ще не вирішило, ким ти маєш бути. Тож тут можна просто зупинитися, озирнутися й зрозуміти, чи хочеш ти залишитися.", "join": "ПРИЄДНАТИСЯ", "login": "УВІЙТИ", "no_ads": "БЕЗ РЕКЛАМИ", "no_feed": "БЕЗ СТРІЧКИ", "no_algorithm": "БЕЗ АЛГОРИТМУ", "search": "ПОШУК / 1984", "search_data": "ДАНІ ПОШУКУ", "channel": "КАНАЛ", "status": "СТАТУС", "open": "ВІДКРИТО", "visitors": "ВІДВІДУВАЧІ", "description_index": "01 / ОПИС", "description_title": "ОПИС", "desc1": "NORTEMS — це не спроба створити ще одну сторінку, яку перегортають між двома сповіщеннями. Це невеликий цифровий простір для людей, яким цікаво знаходити дивне, створювати власне та говорити не лише про те, що вже стало популярним.", "desc2": "Тут не потрібно виглядати певним чином. Не треба шукати правильну відповідь або доводити, що ти достатньо цікавий. Можна прийти з ідеєю, історією, проєктом або просто з цікавістю.", "quote1": "«СПОЧАТКУ ПОДИВИСЬ.", "quote2": "ПОТІМ ВИРІШУЙ, ЧИ ЗАЛИШАТИСЯ.»", "people_index": "02 / УЧАСНИКИ", "people_title": "УЧАСНИКИ", "soon": "СКОРО.", "people_desc": "Розділ поки закритий. Тут з'являться учасники мережі.", "archive_kicker": "АРХІВ / ЗМІНИ", "archive_title": "Історія проєкту", "v1": "Стара версія", "v1p": "Перший варіант Аут-Лайну — яскрава рекламна естетика, насичені кольори та велика подача.", "v2": "Перехід", "v2p": "Інтерфейс перевели у строгу ретро-комп'ютерну естетику: CRT, термінальна графіка та системні елементи.", "v3": "Нова версія", "v3p": "Додано бічну навігацію, чотири кольорові теми, меню та базові інтерактивні функції.", "app_index": "04 / АНКЕТА", "app_title1": "ХОЧЕШ", "app_title2": "УВІЙТИ?", "app_desc": "Заповни коротку анкету. Жодних публічних профілів без твоєї згоди.", "name": "ІМ'Я", "address": "ЯК ДО ТЕБЕ ЗВЕРТАТИСЯ", "email": "EMAIL", "purpose": "МЕТА", "story": "ПРО СЕБЕ", "human": "ПЕРЕВІРКА: НЕ БОТ", "check": "ПЕРЕВІРИТИ", "submit": "НАДІСЛАТИ ЗАЯВКУ →", "name_ph": "Ім'я", "address_ph": "Ім'я / нік", "email_ph": "you@example.com", "purpose_ph": "Навіщо подаєш заявку?", "story_ph": "Розкажи трохи про себе", "language_kicker": "МОВА", "language_title": "Оберіть мову", "english": "Англійська", "chinese": "Китайська", "russian": "Російська", "ukrainian": "Українська", "japanese": "Японська", "close": "ЗАКРИТИ", "menu_open": "Відкрити головне меню", "menu_title": "Відкрити меню", "transmitting": "ПЕРЕДАЧА ДАНИХ...", "human_states": "З'ЄДНАННЯ...|АНАЛІЗ...|СИНХРОНІЗАЦІЯ...|ПЕРЕВІРКА...|OK // ЛЮДИНА", "human_ready": "✓ ГОТОВО", "human_reset": "ПЕРЕВІРИТИ", "human_reset_text": "ПЕРЕВІРКА: НЕ БОТ", "success_kicker": "ПЕРЕДАЧУ ЗАВЕРШЕНО", "success_title1": "ЗАЯВКУ", "success_title2": "ПРИЙНЯТО.", "success_desc": "Система отримала твою анкету. Тепер залишається чекати відповіді. Перший крок зроблено.", "success_back": "ПОВЕРНУТИСЯ", "error_prefix": "ПОМИЛКА: ", "channel_closed": "ЗАЯВКУ ПРИЙНЯТО // КАНАЛ ЗАКРИТО", "theme_green": "ЗЕЛЕНА", "theme_cyan": "БЛАКИТНА", "theme_red": "ЧЕРВОНА", "theme_yellow": "ЖОВТА", "theme_msg": "ТЕМА"}, "ja": {"brand": "NORTEMS", "network": "ネットワーク // 84", "sys": "システム.84", "online": "オンライン", "time": "時間", "language": "言語", "contact": "連絡", "theme": "テーマ", "tiktok": "TikTok", "youtube": "YouTube", "discord": "Discord", "main_menu": "メインメニュー", "home": "ホーム", "about_nav": "NORTEMSについて", "people_nav": "メンバー", "archive_nav": "アーカイブ", "join_nav": "参加する", "about_en": "説明", "people_en": "メンバー", "archive_en": "アーカイブ", "join_en": "参加する", "channel_status": "チャンネル：NORTEMS / ステータス：公開", "connection": "> 接続完了_", "welcome": "> ようこそ、訪問者。", "first_visit": "[ プライベートネットワーク // 初回訪問 ]", "company": "アウトライン", "hero": "ここはまだ、あなたが何者であるべきかを決めていません。だから、少し立ち止まり、周りを見て、残りたいかどうかを決めることができます。", "join": "参加する", "login": "ログイン", "no_ads": "広告なし", "no_feed": "フィードなし", "no_algorithm": "アルゴリズムなし", "search": "検索 / 1984", "search_data": "検索データ", "channel": "チャンネル", "status": "ステータス", "open": "公開", "visitors": "訪問者", "description_index": "01 / 説明", "description_title": "説明", "desc1": "NORTEMSは、通知の合間に流されてしまうような、もう一つのページを作るためのものではありません。奇妙なものを見つけ、自分のものを作り、すでに人気になったものだけでなく会話する人のための小さなデジタル空間です。", "desc2": "ここでは、決まった見た目でいる必要はありません。正解を選んだり、自分が十分に面白いと証明したりする必要もありません。アイデア、物語、プロジェクト、または純粋な好奇心を持って来ることができます。", "quote1": "「まず見て。", "quote2": "残るかどうかは、その後で決める。」", "people_index": "02 / メンバー", "people_title": "メンバー", "soon": "近日公開。", "people_desc": "このセクションは現在閉鎖されています。ネットワークのメンバーがここに表示されます。", "archive_kicker": "アーカイブ / 変更履歴", "archive_title": "プロジェクトの履歴", "v1": "旧バージョン", "v1p": "アウトラインの最初のバージョンは、明るい広告的なデザインと鮮やかな色、大胆な表現を採用していました。", "v2": "移行", "v2p": "インターフェースはCRT、ターミナルグラフィック、システム要素を中心とした厳格なレトロコンピューター風へ変更されました。", "v3": "新バージョン", "v3p": "サイドナビゲーション、4つのカラーテーマ、メニュー、基本的なインタラクションを追加しました。", "app_index": "04 / 申請", "app_title1": "参加", "app_title2": "しますか？", "app_desc": "短い申請フォームに記入してください。同意なしに公開プロフィールは作成されません。", "name": "名前", "address": "呼び方", "email": "メール", "purpose": "目的", "story": "自己紹介", "human": "ボット確認", "check": "確認", "submit": "申請を送信 →", "name_ph": "名前", "address_ph": "名前 / ニックネーム", "email_ph": "you@example.com", "purpose_ph": "応募の理由は？", "story_ph": "あなたについて少し教えてください", "language_kicker": "言語", "language_title": "言語を選択", "english": "英語", "chinese": "中国語", "russian": "ロシア語", "ukrainian": "ウクライナ語", "japanese": "日本語", "close": "閉じる", "menu_open": "メインメニューを開く", "menu_title": "メニューを開く", "transmitting": "データ送信中...", "human_states": "接続中...|分析中...|同期中...|確認中...|OK // 人間", "human_ready": "✓ 完了", "human_reset": "確認", "human_reset_text": "ボット確認", "success_kicker": "送信完了", "success_title1": "申請を", "success_title2": "受理しました。", "success_desc": "システムが申請を受け取りました。あとは返答を待つだけです。最初の一歩は完了しました。", "success_back": "戻る", "error_prefix": "エラー：", "channel_closed": "申請を受理 // チャンネル終了", "theme_green": "緑", "theme_cyan": "シアン", "theme_red": "赤", "theme_yellow": "黄色", "theme_msg": "テーマ"}};
const NORTEMS_LANG_NAMES = {ru:"Русский",en:"English",zh:"中文",uk:"Українська",ja:"日本語"};

function applyLanguage(lang) {
  const dict = NORTEMS_I18N[lang] || NORTEMS_I18N.ru;
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (dict[key] !== undefined) el.placeholder = dict[key];
  });
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    const key = el.dataset.i18nTitle;
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  document.querySelectorAll("[data-i18n-content]").forEach(el => {
    const key = el.dataset.i18nContent;
    if (dict[key] !== undefined) el.setAttribute("content", dict[key]);
  });
  document.querySelectorAll("[data-i18n-attr]").forEach(el => {
    const [attr,key] = el.dataset.i18nAttr.split(":");
    if (dict[key] !== undefined) el.setAttribute(attr, dict[key]);
  });

  localStorage.setItem("nortems-language", lang);
  const title = document.querySelector("title");
  if (title) title.textContent = dict.brand + " // " + dict.network;
}

document.addEventListener("DOMContentLoaded", () => {
  applyLanguage(localStorage.getItem("nortems-language") || "ru");

  document.querySelectorAll(".language-options button").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      if (!lang) return;
      localStorage.setItem("nortems-language", lang);
      window.location.reload();
    });
  });

  const languageModal = document.getElementById("languageModal");
  const languageClose = document.getElementById("languageClose");
  if (languageClose) languageClose.addEventListener("click", () => {
    languageModal.classList.remove("open");
    languageModal.setAttribute("aria-hidden","true");
  });
  if (languageModal) languageModal.addEventListener("click", e => {
    if (e.target === languageModal) {
      languageModal.classList.remove("open");
      languageModal.setAttribute("aria-hidden","true");
    }
  });

  const successModal = document.getElementById("successModal");
  const successBack = document.getElementById("successBack");
  if (successBack) successBack.addEventListener("click", () => {
    successModal.classList.remove("open");
    successModal.setAttribute("aria-hidden","true");
    document.getElementById("join")?.scrollIntoView({behavior:"smooth"});
  });
  if (successModal) successModal.addEventListener("click", e => {
    if (e.target === successModal) {
      successModal.classList.remove("open");
      successModal.setAttribute("aria-hidden","true");
    }
  });
});
