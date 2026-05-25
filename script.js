(function () {
  "use strict";

  const PETAL_COUNT = 18;
  const PETAL_COUNT_INTENSE = 28;
  const NO_ATTEMPTS_HINT = 3;
  const NOTIFY_EMAIL = "artem.gradilenko@gmail.com";

  let yesEmailSent = false;

  const petalsContainer = document.getElementById("petals");
  const musicPanel = document.getElementById("musicPanel");
  const musicToggle = document.getElementById("musicToggle");
  const trackSelect = document.getElementById("trackSelect");
  const bgMusic = document.getElementById("bgMusic");
  const btnYes = document.getElementById("btnYes");
  const btnNo = document.getElementById("btnNo");
  const cta = document.getElementById("cta");
  const celebrate = document.getElementById("celebrate");
  const heartsBurst = document.getElementById("heartsBurst");
  const ctaButtons = document.getElementById("ctaButtons");

  let noAttempts = 0;
  let musicEnabled = sessionStorage.getItem("musicEnabled") === "true";
  let savedTrack = sessionStorage.getItem("musicTrack") || "assets/music.mp3";

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function createPetals(count) {
    if (prefersReducedMotion() || !petalsContainer) return;
    petalsContainer.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.style.left = Math.random() * 100 + "%";
      petal.style.animationDuration = 6 + Math.random() * 8 + "s";
      petal.style.animationDelay = Math.random() * 10 + "s";
      petal.style.width = 12 + Math.random() * 14 + "px";
      petal.style.height = 14 + Math.random() * 16 + "px";
      petalsContainer.appendChild(petal);
    }
  }

  function initReveals() {
    const reveals = document.querySelectorAll(".reveal");
    if (prefersReducedMotion()) {
      reveals.forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    reveals.forEach((el, i) => {
      if (i === 0) {
        setTimeout(() => el.classList.add("visible"), 300);
      } else {
        observer.observe(el);
      }
    });
  }

  function updateMusicUI(playing) {
    musicToggle.setAttribute("aria-pressed", playing ? "true" : "false");
    musicToggle.setAttribute(
      "aria-label",
      playing ? "Выключить музыку" : "Включить музыку"
    );
    musicToggle.querySelector(".music-label").textContent = playing
      ? "Музыка играет"
      : "Включить музыку";
  }

  function setTrack(src, autoplay) {
    if (!bgMusic || !src) return;
    const wasPlaying = !bgMusic.paused;
    bgMusic.src = src;
    bgMusic.load();
    sessionStorage.setItem("musicTrack", src);
    savedTrack = src;

    if (trackSelect) {
      trackSelect.value = src;
    }

    if (autoplay || wasPlaying) {
      bgMusic.play().then(() => {
        musicEnabled = true;
        sessionStorage.setItem("musicEnabled", "true");
        updateMusicUI(true);
      }).catch(() => updateMusicUI(false));
    }
  }

  async function toggleMusic() {
    if (!bgMusic) return;
    try {
      if (bgMusic.paused) {
        if (!bgMusic.src) {
          bgMusic.src = savedTrack;
          bgMusic.load();
        }
        await bgMusic.play();
        musicEnabled = true;
        sessionStorage.setItem("musicEnabled", "true");
        updateMusicUI(true);
      } else {
        bgMusic.pause();
        musicEnabled = false;
        sessionStorage.setItem("musicEnabled", "false");
        updateMusicUI(false);
      }
    } catch {
      musicToggle.querySelector(".music-label").textContent =
        "Не удалось воспроизвести";
    }
  }

  function moveNoButton() {
    const container = ctaButtons.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();
    const maxX = container.width - btnRect.width - 10;
    const maxY = container.height - btnRect.height - 10;
    const x = Math.max(0, Math.random() * maxX);
    const y = Math.max(0, Math.random() * maxY);
    btnNo.style.position = "absolute";
    btnNo.style.left = x + "px";
    btnNo.style.top = y + "px";
  }

  function onNoInteraction() {
    noAttempts++;
    moveNoButton();
    if (noAttempts >= NO_ATTEMPTS_HINT) {
      btnNo.textContent = "Шутка) Всё же жми «Да»";
    }
  }

  function spawnFlowers() {
    if (!heartsBurst || prefersReducedMotion()) return;
    const blooms = ["🌸", "🌼", "✿", "🌻", "🌸", "🌼", "✿", "🌸"];
    blooms.forEach((char, i) => {
      const el = document.createElement("span");
      el.className = "heart-float";
      el.textContent = char;
      el.style.left = 10 + Math.random() * 80 + "%";
      el.style.top = 40 + Math.random() * 30 + "%";
      el.style.animationDelay = i * 0.15 + "s";
      heartsBurst.appendChild(el);
      setTimeout(() => el.remove(), 2500);
    });
  }

  function sendYesNotification() {
    if (yesEmailSent) return;
    yesEmailSent = true;

    const now = new Date().toLocaleString("ru-RU", {
      dateStyle: "long",
      timeStyle: "short",
    });

    fetch("https://formsubmit.co/ajax/" + encodeURIComponent(NOTIFY_EMAIL), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: "Маша согласилась на свидание!",
        _template: "table",
        _captcha: "false",
        message:
          "Маша нажала «Да» на странице-приглашении.\n\nВремя: " +
          now +
          "\nСтраница: " +
          (window.location.href || "—"),
        name: "Приглашение для Маши",
      }),
    }).catch(function () {
      yesEmailSent = false;
    });
  }

  function onYes() {
    sendYesNotification();

    cta.classList.add("hidden");
    cta.setAttribute("aria-hidden", "true");
    celebrate.classList.remove("hidden");
    petalsContainer.classList.add("petals--intense");
    createPetals(PETAL_COUNT_INTENSE);
    spawnFlowers();

    const title = celebrate.querySelector(".celebrate-title");
    if (title && !title.querySelector(".pulse-heart")) {
      title.innerHTML =
        'Отлично! <span class="pulse-heart" aria-hidden="true">🌸</span>';
    }

    celebrate.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function initMusic() {
    if (trackSelect) {
      const optionExists = Array.from(trackSelect.options).some(
        (o) => o.value === savedTrack
      );
      if (optionExists) {
        trackSelect.value = savedTrack;
      }
      bgMusic.src = trackSelect.value;
    }

    if (bgMusic) {
      bgMusic.addEventListener("error", () => {
        const label = musicToggle.querySelector(".music-label");
        if (label) label.textContent = "Ошибка загрузки";
        if (musicPanel) musicPanel.classList.add("music-panel--error");
      });
    }

    if (trackSelect) {
      trackSelect.addEventListener("change", () => {
        setTrack(trackSelect.value, musicEnabled);
      });
    }

    musicToggle.addEventListener("click", toggleMusic);

    document.addEventListener(
      "click",
      function firstInteraction(e) {
        if (musicPanel && musicPanel.contains(e.target)) return;
        if (musicEnabled && bgMusic.paused) {
          bgMusic.play().then(() => updateMusicUI(true)).catch(() => {});
        }
      },
      { once: true }
    );

    updateMusicUI(false);
  }

  function initButtons() {
    btnYes.addEventListener("click", onYes);

    btnNo.addEventListener("mouseenter", moveNoButton);
    btnNo.addEventListener("focus", moveNoButton);
    btnNo.addEventListener("click", (e) => {
      e.preventDefault();
      onNoInteraction();
    });
    btnNo.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        onNoInteraction();
      },
      { passive: false }
    );
  }

  createPetals(PETAL_COUNT);
  initReveals();
  initMusic();
  initButtons();
})();
