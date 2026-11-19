/**
 * Royal Grace — Muhammad Yousaf Malik & Gulnaz Amjad Wedding Invitation
 */

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("locked");

  /* ----------------------------------------------------------------------
     1. PRELOADER & ROYAL CURTAIN REVEAL
     ---------------------------------------------------------------------- */
  const preloader = document.getElementById("preloader");
  const curtainStage = document.getElementById("curtain-stage");
  const openInviteBtn = document.getElementById("open-invite-btn");

  setTimeout(() => {
    preloader.classList.add("fade-out");
  }, 950);

  openInviteBtn.addEventListener("click", () => {
    curtainStage.classList.add("opened");
    document.body.classList.remove("locked");

    // Start romantic wedding music on user gesture
    if (window.weddingMusic) {
      window.weddingMusic.play();
    }

    setTimeout(() => {
      curtainStage.style.display = "none";
    }, 34000);
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
     3. SAVE THE DATE (.ICS DOWNLOAD)
     ---------------------------------------------------------------------- */
  const saveDateBtn = document.getElementById("save-date-btn");
  saveDateBtn.addEventListener("click", () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Muhammad Yousaf Malik & Gulnaz Amjad//Wedding Invitation//EN",
      "BEGIN:VEVENT",
      "UID:yousaf-gulnaz-barat-20261219@royalgrace",
      "DTSTAMP:20261119T180000Z",
      "DTSTART:20261219T140000",
      "DTEND:20261219T190000",
      "SUMMARY:Wedding Celebration of Muhammad Yousaf Malik & Gulnaz Amjad",
      "DESCRIPTION:Mehndi: Fri 18 Dec 2026 (7:00 PM) | Barat: Sat 19 Dec 2026 (2:00 PM) | Waleema: Sun 20 Dec 2026 (2:00 PM) at Noor Palace, Kotla Arab Ali Khan.",
      "LOCATION:Noor Palace, Kotla Rd, near Zahid Fuelling Station, Kotla Arab Ali Khan",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Muhammad-Yousaf-Malik-and-Gulnaz-Amjad-Wedding.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  /* ----------------------------------------------------------------------
     4. LIVE COUNTDOWN TIMER (Barat: Dec 19, 2026 at 2:00 PM)
     ---------------------------------------------------------------------- */
  const targetDate = new Date("2026-12-19T14:00:00").getTime();
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
     8. LANGUAGE SWITCHER (ENGLISH / URDU)
     ---------------------------------------------------------------------- */
  const langToggle = document.getElementById("lang-toggle");
  const langLabel = document.getElementById("lang-label");
  let currentLang = "en";

  const translations = {
    en: {
      tapToOpen: "TAP TO OPEN",
      togetherFamilies: "TOGETHER WITH THEIR FAMILIES",
      delightedInvite: "WE ARE DELIGHTED TO INVITE YOU TO THE WEDDING CELEBRATION OF",
      heroBlessing:
        "We would be honoured by your presence to bless the newlyweds as they begin their new journey together.",
      scroll: "Scroll",
      welcomeText:
        "Together with their families, we are delighted to invite you to the wedding celebration of <strong>Muhammad Yousaf Malik &amp; Gulnaz Amjad</strong>. We would be honoured by your presence to bless the newlyweds as they begin their new journey together ❤",
      saveTheDate: "Save the Date",
      countdownTitle: "Counting Down to Forever",
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
      timelineTitle: "Wedding Celebrations",
      venuesTitle: "Wedding Venues",
      baratVenueKicker: "VENUE (BARAT)",
      venueKicker: "VENUE (WALEEMA)",
      openDirections: "Open in Google Maps",
      closingLine: "Your presence will make our celebration more memorable.",
    },
    ur: {
      tapToOpen: "دعوت نامہ کھولیں",
      togetherFamilies: "اپنے اہلِ خانہ کے ہمراہ",
      delightedInvite: "ہم آپ کو خوشی کے ساتھ شادی کی تقریب میں مدعو کرتے ہیں",
      heroBlessing:
        "نئے سفر کے آغاز پر نوبیاہتا جوڑے کو دعاؤں سے نوازنے کے لیے آپ کی تشریف آوری ہمارے لیے باعثِ اعزاز ہوگی۔",
      scroll: "نیچے دیکھیں",
      welcomeText:
        "ہم اپنے اہلِ خانہ کے ہمراہ آپ کو <strong>محمد یوسف ملک اور گلناز امجد</strong> کی شادی کی تقریب میں خوش آمدید کہتے ہیں۔ آپ کی تشریف آوری اور دعائیں ہمارے لیے باعثِ مسرت ہوں گی ❤",
      saveTheDate: "تاریخ محفوظ کریں",
      countdownTitle: "حسین لمحوں کا انتظار",
      days: "دن",
      hours: "گھنٹے",
      minutes: "منٹ",
      seconds: "سیکنڈ",
      timelineTitle: "شادی کی تقریبات",
      venuesTitle: "تقریبات کے مقامات",
      baratVenueKicker: "مقامِ بارات",
      venueKicker: "مقامِ ولیمہ",
      openDirections: "گوگل میپس میں کھولیں",
      closingLine: "آپ کی تشریف آوری ہماری خوشیوں کو مزید یادگار بنا دے گی۔",
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
