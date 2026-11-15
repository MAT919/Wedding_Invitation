/**
 * Royal Grace — Yousaf & Gulle e Yousaf Wedding Invitation Interactions
 */

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("locked");

  /* ----------------------------------------------------------------------
     1. PRELOADER & GATEFOLD REVEAL
     ---------------------------------------------------------------------- */
  const preloader = document.getElementById("preloader");
  const gatefold = document.getElementById("gatefold");
  const openInviteBtn = document.getElementById("open-invite-btn");

  setTimeout(() => {
    preloader.classList.add("fade-out");
  }, 950);

  openInviteBtn.addEventListener("click", () => {
    gatefold.classList.add("opened");
    document.body.classList.remove("locked");

    // Start romantic wedding music on user gesture
    if (window.weddingMusic) {
      window.weddingMusic.play();
    }

    setTimeout(() => {
      gatefold.style.display = "none";
    }, 1500);
  });

  /* ----------------------------------------------------------------------
     2. AUDIO & TRACK MENU CONTROLS
     ---------------------------------------------------------------------- */
  const audioToggle = document.getElementById("audio-toggle");
  const iconSoundOn = document.getElementById("icon-sound-on");
  const iconSoundOff = document.getElementById("icon-sound-off");
  const eqBars = document.getElementById("eq-bars");
  const musicMenuBtn = document.getElementById("music-menu-btn");
  const musicPopover = document.getElementById("music-popover");
  const trackLabel = document.getElementById("current-track-label");
  const trackOptions = document.querySelectorAll(".track-option");
  const customAudioInput = document.getElementById("custom-audio-input");

  function syncAudioUI({ isPlaying, trackName, trackIndex }) {
    iconSoundOn.classList.toggle("hidden", !isPlaying);
    iconSoundOff.classList.toggle("hidden", isPlaying);
    eqBars.classList.toggle("playing", isPlaying);
    trackLabel.textContent = trackName;
    trackOptions.forEach((btn, idx) => {
      btn.classList.toggle("active", idx === trackIndex);
    });
  }

  if (window.weddingMusic) {
    window.weddingMusic.onStateChange = syncAudioUI;
  }

  audioToggle.addEventListener("click", () => {
    window.weddingMusic.toggle();
  });

  musicMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    musicPopover.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!musicPopover.contains(e.target) && e.target !== musicMenuBtn) {
      musicPopover.classList.add("hidden");
    }
  });

  trackOptions.forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.track);
      window.weddingMusic.setTrack(idx);
      if (!window.weddingMusic.isPlaying) {
        window.weddingMusic.play();
      }
    });
  });

  customAudioInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (file) {
      window.weddingMusic.loadCustomFile(file);
      musicPopover.classList.add("hidden");
    }
  });

  /* ----------------------------------------------------------------------
     3. INTERACTIVE SCRATCH-TO-REVEAL EMERALD GLITTER HEART
     ---------------------------------------------------------------------- */
  const canvas = document.getElementById("scratch-canvas");
  const revealFallbackBtn = document.getElementById("reveal-fallback-btn");
  const ctx = canvas.getContext("2d");
  let isDrawing = false;
  let isRevealed = false;

  function drawEmeraldGlitterHeart() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Cream card cover backdrop
    ctx.fillStyle = "#efe5d5";
    ctx.fillRect(0, 0, w, h);

    // Heart path
    ctx.save();
    ctx.beginPath();
    const cx = w / 2;
    const cy = h / 2 + 6;
    ctx.moveTo(cx, cy + 58);
    ctx.bezierCurveTo(cx - 95, cy - 5, cx - 85, cy - 90, cx, cy - 38);
    ctx.bezierCurveTo(cx + 85, cy - 90, cx + 95, cy - 5, cx, cy + 58);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, 20, w, h - 20);
    grad.addColorStop(0, "#355338");
    grad.addColorStop(0.5, "#4a6b48");
    grad.addColorStop(1, "#243b25");
    ctx.fillStyle = grad;
    ctx.fill();

    // Clip to heart for glitter sparkles
    ctx.clip();
    for (let i = 0; i < 420; i++) {
      const gx = Math.random() * w;
      const gy = Math.random() * h;
      const r = Math.random() * 1.9 + 0.4;
      ctx.fillStyle =
        Math.random() > 0.35
          ? `rgba(228, 203, 148, ${Math.random() * 0.65 + 0.2})`
          : `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
      ctx.beginPath();
      ctx.arc(gx, gy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Subtle label on heart
    ctx.fillStyle = "rgba(250, 246, 240, 0.9)";
    ctx.font = "500 13px Cinzel, serif";
    ctx.textAlign = "center";
    ctx.fillText("SCRATCH HERE", cx, cy + 4);
  }

  drawEmeraldGlitterHeart();

  function getPointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function scratchAt(pos) {
    if (isRevealed) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2);
    ctx.fill();
    checkRevealProgress();
  }

  function checkRevealProgress() {
    if (isRevealed) return;
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    const total = pixels.length / 4;
    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) cleared++;
    }
    if (cleared / (total / 4) > 0.38) {
      completeScratchReveal();
    }
  }

  function completeScratchReveal() {
    isRevealed = true;
    canvas.classList.add("cleared");
    revealFallbackBtn.classList.add("hidden");
  }

  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    scratchAt(getPointerPos(e));
  });
  window.addEventListener("mousemove", (e) => {
    if (isDrawing) scratchAt(getPointerPos(e));
  });
  window.addEventListener("mouseup", () => {
    isDrawing = false;
  });

  canvas.addEventListener(
    "touchstart",
    (e) => {
      isDrawing = true;
      scratchAt(getPointerPos(e));
    },
    { passive: true }
  );
  canvas.addEventListener(
    "touchmove",
    (e) => {
      if (isDrawing) scratchAt(getPointerPos(e));
    },
    { passive: true }
  );
  canvas.addEventListener("touchend", () => {
    isDrawing = false;
  });

  revealFallbackBtn.addEventListener("click", completeScratchReveal);

  /* ----------------------------------------------------------------------
     4. SAVE THE DATE (.ICS DOWNLOAD)
     ---------------------------------------------------------------------- */
  const saveDateBtn = document.getElementById("save-date-btn");
  saveDateBtn.addEventListener("click", () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Yousaf & Gulle e Yousaf//Wedding Invitation//EN",
      "BEGIN:VEVENT",
      "UID:yousaf-gulle-e-yousaf-20270131@royalgrace",
      "DTSTAMP:20261115T180000Z",
      "DTSTART:20270131T103000",
      "DTEND:20270131T160000",
      "SUMMARY:Wedding Ceremony of Yousaf & Gulle e Yousaf",
      "DESCRIPTION:Join us in celebrating the Nikah & Wedding Ceremony of Yousaf & Gulle e Yousaf.",
      "LOCATION:Grand Royal Palace Hall, City Centre",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Yousaf-and-Gulle-e-Yousaf-Wedding.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  /* ----------------------------------------------------------------------
     5. COUPLE PHOTO CAROUSEL
     ---------------------------------------------------------------------- */
  const slides = document.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(".carousel-dots .dot");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  let currentSlide = 0;

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("active", i === currentSlide));
    dots.forEach((d, i) => d.classList.toggle("active", i === currentSlide));
  }

  prevBtn.addEventListener("click", () => showSlide(currentSlide - 1));
  nextBtn.addEventListener("click", () => showSlide(currentSlide + 1));
  dots.forEach((dot) => {
    dot.addEventListener("click", () => showSlide(Number(dot.dataset.index)));
  });

  setInterval(() => showSlide(currentSlide + 1), 6000);

  /* ----------------------------------------------------------------------
     6. LIVE COUNTDOWN TIMER (Jan 31, 2027 10:30 AM)
     ---------------------------------------------------------------------- */
  const targetDate = new Date("2027-01-31T10:30:00").getTime();
  const cdDays = document.getElementById("cd-days");
  const cdHours = document.getElementById("cd-hours");
  const cdMinutes = document.getElementById("cd-minutes");
  const cdSeconds = document.getElementById("cd-seconds");

  function updateCountdown() {
    const diff = Math.max(0, targetDate - Date.now());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    cdDays.textContent = String(days).padStart(2, "0");
    cdHours.textContent = String(hours).padStart(2, "0");
    cdMinutes.textContent = String(minutes).padStart(2, "0");
    cdSeconds.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ----------------------------------------------------------------------
     7. SCROLL REVEAL OBSERVER
     ---------------------------------------------------------------------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ----------------------------------------------------------------------
     8. RSVP FORM & LOCAL WISHES WALL
     ---------------------------------------------------------------------- */
  const rsvpForm = document.getElementById("rsvp-form");
  const rsvpSuccess = document.getElementById("rsvp-success");
  const wishesWall = document.getElementById("wishes-wall");
  const wishesList = document.getElementById("wishes-list");
  const STORAGE_KEY = "yousaf_gulle_rsvps_v1";

  function renderWishes() {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (saved.length === 0) return;
    wishesWall.classList.remove("hidden");
    wishesList.innerHTML = "";
    saved
      .slice()
      .reverse()
      .forEach((item) => {
        const card = document.createElement("div");
        card.className = "wish-item";

        const meta = document.createElement("div");
        meta.className = "wish-meta";
        const nameEl = document.createElement("span");
        nameEl.textContent = item.name;
        const statusEl = document.createElement("span");
        statusEl.className = "wish-status";
        statusEl.textContent = item.attending;
        meta.appendChild(nameEl);
        meta.appendChild(statusEl);
        card.appendChild(meta);

        if (item.message) {
          const msgEl = document.createElement("p");
          msgEl.textContent = item.message;
          card.appendChild(msgEl);
        }
        wishesList.appendChild(card);
      });
  }

  renderWishes();

  rsvpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("guest-name").value.trim();
    const attending = document.getElementById("guest-attending").value;
    const message = document.getElementById("guest-message").value.trim();
    if (!name || !attending) return;

    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    existing.push({ name, attending, message, date: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

    rsvpForm.reset();
    rsvpSuccess.classList.remove("hidden");
    renderWishes();
  });

  /* ----------------------------------------------------------------------
     9. LANGUAGE SWITCHER (ENGLISH / URDU)
     ---------------------------------------------------------------------- */
  const langToggle = document.getElementById("lang-toggle");
  const langLabel = document.getElementById("lang-label");
  let currentLang = "en";

  const translations = {
    en: {
      tapToOpen: "TAP TO OPEN",
      wereGettingMarried: "WE'RE GETTING MARRIED",
      groomParentage: "Son of Mr. & Mrs. Tariq",
      brideParentage: "Daughter of Mr. & Mrs. Khan",
      scroll: "Scroll",
      welcomeText:
        "We are honored to welcome you to the Wedding ceremony of <strong>Yousaf &amp; Gulle e Yousaf</strong>. As they begin their journey together in faith and love, we thank you for being part of this blessed occasion ❤",
      scratchTitle: "Scratch to Reveal",
      scratchHint: "Gently rub the emerald heart below to reveal our wedding date",
      saveTheDate: "Save the Date",
      countdownTitle: "Counting Down to Forever",
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
      timelineTitle: "Program Timeline",
      venueTitle: "Venue",
      dressCodeTitle: "Dress Code",
      preWeddingTitle: "Pre-Wedding Events",
      transportTitle: "Transportation",
      accommodationTitle: "Accommodation",
      giftsTitle: "Gifts",
      giftsCopy: "Your love, blessings, and presence are the greatest gifts we could ever ask for.",
      sendMessage: "Send Message",
      closingLine: "We can't wait to celebrate with you!",
    },
    ur: {
      tapToOpen: "دعوت نامہ کھولیں",
      wereGettingMarried: "ہماری شادی کی تقریب",
      groomParentage: "فرزندِ جناب و محترمہ طارق",
      brideParentage: "دخترِ جناب و محترمہ خان",
      scroll: "نیچے دیکھیں",
      welcomeText:
        "ہمیں آپ کو <strong>یوسف اور گلِ یوسف</strong> کی تقریبِ نکاح و شادی میں خوش آمدید کہتے ہوئے بے حد مسرت ہو رہی ہے۔ اس مبارک موقع پر آپ کی شرکت ہمارے لیے باعثِ برکت ہے ❤",
      scratchTitle: "تاریخ دیکھنے کے لیے کھرچیں",
      scratchHint: "شادی کی تاریخ جاننے کے لیے نیچے سبز دل کو ہلکا سا رگڑیں",
      saveTheDate: "تاریخ محفوظ کریں",
      countdownTitle: "حسین لمحوں کا انتظار",
      days: "دن",
      hours: "گھنٹے",
      minutes: "منٹ",
      seconds: "سیکنڈ",
      timelineTitle: "تقریبات کی تفصیل",
      venueTitle: "مقامِ تقریب",
      dressCodeTitle: "لباس",
      preWeddingTitle: "شادی سے قبل کی تقریبات",
      transportTitle: "آمد و رفت",
      accommodationTitle: "رہائش",
      giftsTitle: "تحائف",
      giftsCopy: "آپ کی محبت، دعائیں اور تشریف آوری ہی ہمارے لیے سب سے بڑا تحفہ ہے۔",
      sendMessage: "پیغام بھیجیں",
      closingLine: "ہم آپ کے ساتھ خوشیاں بانٹنے کے منتظر ہیں!",
    },
  };

  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "ur" : "en";
    langLabel.textContent = currentLang === "en" ? "اردو" : "English";
    const dict = translations[currentLang];
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });
  });
});
