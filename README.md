# RETRO NETWORK — Vercel version

Загрузите содержимое этой папки в корень GitHub-репозитория.

В Vercel → Settings → Environment Variables → Production добавьте:
- SMTP_HOST = smtp.gmail.com
- SMTP_PORT = 465
- SMTP_SECURE = true
- SMTP_USER = ваш Gmail
- SMTP_PASS = Gmail App Password
- NOTIFY_TO = sandorado100@gmail.com

После изменения переменных сделайте Redeploy.
Не загружайте `.env` в GitHub.
