/**
 * Royal Grace — Muhammad Yousaf Malik & Gulnaz Amjad Wedding Invitation
 */

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);
window.addEventListener("beforeunload", () => window.scrollTo(0, 0));
window.addEventListener("pageshow", () => window.scrollTo(0, 0));

document.addEventListener("DOMContentLoaded", () => {
  window.scrollTo(0, 0);
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
    window.scrollTo(0, 0);

    // Start romantic wedding music on user gesture
    if (window.weddingMusic) {
      window.weddingMusic.play();
    }

    setTimeout(() => {
      curtainStage.style.display = "none";
    }, 5100);
  });

  /* ----------------------------------------------------------------------
     2. AUDIO TOGGLE CONTROL
     ---------------------------------------------------------------------- */
  const audioToggle = document.getElementById("audio-toggle");
  const iconSoundOn = document.getElementById("icon-sound-on");
  const iconSoundOff = document.getElementById("icon-sound-off");

  function syncAudioUI({ isPlaying }) {
    iconSoundOn.classList.toggle("hidden", !isPlaying);
    iconSoundOff.classList.toggle("hidden", isPlaying);
  }

  if (window.weddingMusic) {
    window.weddingMusic.onStateChange = syncAudioUI;
  }

  audioToggle.addEventListener("click", () => {
    window.weddingMusic.toggle();
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
      "UID:yousaf-gulnaz-mehndi-20261218@royalgrace",
      "DTSTAMP:20261119T180000Z",
      "DTSTART:20261218T190000",
      "DTEND:20261218T230000",
      "SUMMARY:Mehndi — Muhammad Yousaf Malik & Gulnaz Amjad",
      "DESCRIPTION:Mehndi celebration of Muhammad Yousaf Malik & Gulnaz Amjad starting at 7:00 PM.",
      "END:VEVENT",
      "BEGIN:VEVENT",
      "UID:yousaf-gulnaz-barat-20261219@royalgrace",
      "DTSTAMP:20261119T180000Z",
      "DTSTART:20261219T180000",
      "DTEND:20261219T230000",
      "SUMMARY:Barat — Muhammad Yousaf Malik & Gulnaz Amjad",
      "DESCRIPTION:Barat wedding ceremony of Muhammad Yousaf Malik & Gulnaz Amjad starting at 6:00 PM.",
      "LOCATION:Gujrat",
      "END:VEVENT",
      "BEGIN:VEVENT",
      "UID:yousaf-gulnaz-waleema-20261220@royalgrace",
      "DTSTAMP:20261119T180000Z",
      "DTSTART:20261220T140000",
      "DTEND:20261220T180000",
      "SUMMARY:Waleema — Muhammad Yousaf Malik & Gulnaz Amjad",
      "DESCRIPTION:Waleema reception of Muhammad Yousaf Malik & Gulnaz Amjad starting at 2:00 PM.",
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
     4. LIVE COUNTDOWN TIMER (Barat: Dec 19, 2026 at 6:00 PM)
     ---------------------------------------------------------------------- */
  const targetDate = new Date("2026-12-19T18:00:00").getTime();
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
});
