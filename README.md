# Приглашение встретиться — для Маши

Одностраничный сайт-приглашение: при нажатии **«Да»** на почту **artem.gradilenko@gmail.com** уходит уведомление.

## Как открыть локально

```bash
npx serve .
```

Или откройте `index.html` в браузере.  
Письмо при «Да» **работает только на опубликованном сайте** (https), не с диска `file://`.

## Уведомление на почту

Используется бесплатный сервис [FormSubmit](https://formsubmit.co/).

### Один раз перед отправкой Маше

1. Залейте сайт на хостинг (инструкция ниже).
2. Откройте опубликованную ссылку сами и нажмите **«Да, давай!»**.
3. На **artem.gradilenko@gmail.com** придёт письмо от FormSubmit с кнопкой **Activate Form** — нажмите её.
4. После активации каждое нажатие «Да» будет присылать письмо с темой «Маша согласилась на свидание!».

Почту для уведомлений можно сменить в [`script.js`](script.js) — константа `NOTIFY_EMAIL`.

## Музыка

В `assets/`: `music.mp3` и `music-test.mp3`. Выбор — в правом верхнем углу страницы.

---

## Как захостить бесплатно

Нужна ссылка вида `https://...`, чтобы музыка, письма и анимации работали стабильно.

### Способ 1 — Netlify Drop (самый простой, ~2 минуты)

1. Откройте [app.netlify.com/drop](https://app.netlify.com/drop).
2. Перетащите **всю папку** `Invite` в окно браузера.
3. Скопируйте ссылку вида `https://случайное-имя.netlify.app`.
4. Отправьте её Маше в мессенджере.

Регистрация не обязательна для первого деплоя. Чтобы сменить адрес на свой поддомен — бесплатная регистрация на Netlify.

### Способ 2 — GitHub Pages

1. Создайте аккаунт на [github.com](https://github.com), если его нет.
2. **New repository** → имя, например `invite-masha` → **Public** → Create.
3. Загрузите файлы проекта (кнопка **upload** или через Git):

```bash
cd c:\Users\user\Invite
git init
git add .
git commit -m "Invite page for Masha"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/invite-masha.git
git push -u origin main
```

4. В репозитории: **Settings → Pages**.
5. **Source:** Deploy from branch → **main** → папка **/ (root)** → Save.
6. Через 1–2 минуты сайт будет по адресу:  
   `https://ВАШ_ЛОГИН.github.io/invite-masha/`

### Способ 3 — Cloudflare Pages

1. Регистрация на [dash.cloudflare.com](https://dash.cloudflare.com).
2. **Workers & Pages → Create → Pages → Upload assets**.
3. Загрузите папку `Invite`.
4. **Deploy** → получите ссылку `https://имя.pages.dev`.

### Способ 4 — Vercel

1. [vercel.com](https://vercel.com) → Sign up (можно через GitHub).
2. **Add New → Project** → Import Git-репозиторий или **Upload** папку.
3. Root directory: `.` → Deploy.
4. Ссылка вида `https://проект.vercel.app`.

---

## Что отправить Маше

Одну ссылку на опубликованный сайт, например:

> Маша, загляни сюда 🌸  
> https://ваш-сайт.netlify.app

---

## Структура проекта

```
Invite/
  index.html
  styles.css
  script.js          — кнопки, музыка, отправка письма при «Да»
  assets/
    flowers.svg
    music.mp3
    music-test.mp3
  README.md
```

## Особенности

- **«Да»** — праздничный экран + письмо на почту.
- **«Нет»** — кнопка убегает (шутка).
- Фоновая музыка по клику.
- Поддержка `prefers-reduced-motion`.
