const express = require("express");
const nodemailer = require("nodemailer");
const app = express();

app.use(express.json({ limit: "50kb" }));

const clean = (v, max=5000) => String(v ?? "").trim().slice(0,max);
const escapeHtml = s => s.replace(/[&<>"']/g, c => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
}[c]));

app.post("/api/register", async (req, res) => {
  try {
    const name=clean(req.body.name,120);
    const addressName=clean(req.body.addressName,120);
    const email=clean(req.body.email,254).toLowerCase();
    const goal=clean(req.body.goal,1000);
    const about=clean(req.body.about,5000);

    if (!name || !addressName || !email || !goal || !about || req.body.humanCheck !== true)
      return res.status(400).json({ok:false,message:"Заполните все поля и завершите проверку."});

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ok:false,message:"Укажите корректный адрес электронной почты."});

    const missing=["SMTP_HOST","SMTP_PORT","SMTP_USER","SMTP_PASS","NOTIFY_TO"].filter(k=>!process.env[k]);
    if (missing.length) {
      console.error("Missing environment variables:", missing);
      return res.status(500).json({ok:false,message:"Почтовая система не настроена на сервере."});
    }

    const transporter=nodemailer.createTransport({
      host:process.env.SMTP_HOST,
      port:Number(process.env.SMTP_PORT),
      secure:String(process.env.SMTP_SECURE||"true")==="true",
      auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}
    });

    await transporter.verify();

    const now=new Date().toLocaleString("ru-RU",{
      timeZone:"Europe/Kyiv",dateStyle:"full",timeStyle:"medium"
    });

    await transporter.sendMail({
      from:`"RETRO NETWORK" <${process.env.SMTP_USER}>`,
      to:process.env.NOTIFY_TO,
      replyTo:email,
      subject:`НОВАЯ ЗАЯВКА // ${name}`,
      text:`НОВАЯ РЕГИСТРАЦИЯ

Имя: ${name}
Как обращаться: ${addressName}
Email: ${email}

Цель подачи:
${goal}

Рассказ о себе:
${about}

Дата: ${now}`,
      html:`<div style="font-family:Arial,sans-serif;line-height:1.6">
        <h1>НОВАЯ РЕГИСТРАЦИЯ</h1>
        <p><b>Имя:</b> ${escapeHtml(name)}</p>
        <p><b>Как обращаться:</b> ${escapeHtml(addressName)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        <h3>Цель подачи</h3><p>${escapeHtml(goal).replace(/\n/g,"<br>")}</p>
        <h3>Рассказ о себе</h3><p>${escapeHtml(about).replace(/\n/g,"<br>")}</p>
        <hr><small>${escapeHtml(now)}</small>
      </div>`
    });

    res.json({ok:true});
  } catch (err) {
    console.error("MAIL ERROR:",err);
    res.status(500).json({ok:false,message:"Сервер не смог отправить письмо. Проверьте SMTP-настройки Vercel."});
  }
});

module.exports=app;
