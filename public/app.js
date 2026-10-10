const w = window.WEDDING;
const $ = (s) => document.querySelector(s);

/* ── Helpers ── */
function set(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}
function setHtml(id, html) {
  const el = $(id);
  if (el) el.innerHTML = html;
}

/* ── Opening screen ── */
set("#openingNames", `${w.bride} & ${w.groom}`);
set("#sealInitials", `${w.bride[0]} & ${w.groom[0]}`);
set("#sealYear", new Date(w.dateISO).getFullYear());
set("#openingDate", w.dateText || "");

$("#openButton").addEventListener("click", () => {
  $("#opening").classList.add("open");
  setTimeout(() => {
    $("#opening").classList.add("hidden");
    $("#site").classList.remove("hidden");
    window.scrollTo(0, 0);
    // Trigger staggered hero entrance
    requestAnimationFrame(() => $("#hero").classList.add("entering"));
  }, 780);
});

/* ── Hero ── */
set("#bride", w.bride);
set("#groom", w.groom);
set("#date", w.dateText);

if (w.heroImage) {
  $("#hero").style.backgroundImage = `url(${w.heroImage})`;
}

$("a[href='#rsvp']")?.addEventListener("click", (e) => {
  e.preventDefault();
  $("#rsvp")?.scrollIntoView({ behavior: "smooth" });
});

/* ── Story ── */
set("#brideName", w.bride);
set("#groomName", w.groom);
set("#brideFamily", w.brideFamily || "");
set("#groomFamily", w.groomFamily || "");
set("#storyInvite", w.storyInvite || "");

if (w.storyLines) {
  setHtml("#storyPoem", w.storyLines.map(l => `<span>${l}</span>`).join(""));
}

/* ── Countdown ── */
function updateCountdown() {
  const remaining = Math.max(0, new Date(w.dateISO) - Date.now());
  const vals = [
    Math.floor(remaining / 864e5),
    Math.floor(remaining / 36e5) % 24,
    Math.floor(remaining / 6e4) % 60,
    Math.floor(remaining / 1e3) % 60,
  ];
  const labels = ["Days", "Hours", "Min", "Sec"];
  setHtml("#countdown", vals.map((v, i) =>
    `<div class="countdown-unit"><span class="countdown-num">${v}</span><span class="countdown-lbl">${labels[i]}</span></div>`
  ).join(""));
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ── Venue cards ── */
if (w.events) {
  setHtml("#venueCards", w.events.map((ev) => `
    <div class="venue-card">
      <p class="venue-card-label">${ev.label.toUpperCase()}</p>
      <div class="venue-card-divider"></div>
      <p class="venue-card-name">${ev.venue}</p>
      <p class="venue-card-loc">${ev.location}</p>
      <div class="venue-card-divider"></div>
      <p class="venue-card-date">${ev.date}</p>
      <p class="venue-card-time">${ev.time}</p>
      <a href="${ev.mapUrl}" target="_blank" rel="noreferrer" class="venue-card-dir">Get Directions ↗</a>
    </div>
  `).join(""));
}

/* ── Schedule / Order of the day ── */
if (w.schedule) {
  setHtml("#scheduleContainer", w.schedule.map(day => `
    <div class="schedule-day">
      <div class="schedule-day-label">${day.day}</div>
      <div class="schedule-items">
        ${day.items.map(item => `
          <div class="schedule-item">
            <div class="schedule-time">${item.time}</div>
            <div class="schedule-body">
              <p class="schedule-title">${item.title}</p>
              <p class="schedule-detail">${item.detail}</p>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `).join(""));
}

/* ── Dress code ── */
set("#dressCode", w.dressCode || "");

/* ── Personal message ── */
set("#letterNames", `${w.bride} & ${w.groom}`);
const msgEl = $("#personalMessage");
if (msgEl && w.personalMessage) {
  msgEl.innerHTML = w.personalMessage.split("\n\n").map(p => `<span>${p}</span>`).join("<br/><br/>");
}

/* ── RSVP ── */
set("#rsvpDeadline", w.rsvpDeadline || "");

// Attendance toggle
const btnAccept = $("#btnAccept");
const btnDecline = $("#btnDecline");
const attendanceVal = $("#attendanceValue");
btnAccept?.addEventListener("click", () => {
  btnAccept.classList.add("active");
  btnDecline.classList.remove("active");
  attendanceVal.value = "Joyfully accepts";
});
btnDecline?.addEventListener("click", () => {
  btnDecline.classList.add("active");
  btnAccept.classList.remove("active");
  attendanceVal.value = "Regretfully declines";
});

// Hotel Yes/No toggle
const hotelYes = $("#hotelYes");
const hotelNo = $("#hotelNo");
const hotelVal = $("#hotelValue");
function setHotel(val, activeBtn, otherBtn) {
  hotelVal.value = val;
  activeBtn.classList.add("active");
  otherBtn.classList.remove("active");
}
hotelYes?.addEventListener("click", () => setHotel("yes", hotelYes, hotelNo));
hotelNo?.addEventListener("click", () => setHotel("no", hotelNo, hotelYes));

// Event checkboxes
if (w.events) {
  setHtml("#eventChecks", w.events.map(ev => `
    <label class="event-check-item">
      <input type="checkbox" name="eventAttend" value="${ev.label}" checked />
      <span class="event-check-box"></span>
      <span class="event-check-info">
        <strong>${ev.label}</strong>
        <small>${ev.date} · ${ev.time}</small>
      </span>
    </label>
  `).join(""));
}

// RSVP submit
$("#rsvpForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const status = $("#rsvpStatus");
  const data = Object.fromEntries(new FormData(e.target));
  data.eventAttend = [...e.target.querySelectorAll("[name=eventAttend]:checked")].map(c => c.value);

  try {
    if (!w.apiUrl) throw new Error("no api");
    const res = await fetch(`${w.apiUrl}/api/rsvp`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("failed");
    e.target.reset();
    status.textContent = "Thank you — your RSVP has been received.";
  } catch {
    status.textContent = w.apiUrl
      ? "Sorry, we couldn't send that. Please try again."
      : "Thank you — your RSVP has been noted.";
  }
});

/* ── Timeline scrolling heart ── */
const schedContainer = $("#scheduleContainer");
if (schedContainer) {
  const heart = document.createElement("span");
  heart.className = "timeline-heart";
  heart.textContent = "♥";
  schedContainer.prepend(heart);

  function updateHeart() {
    const allItems = [...schedContainer.querySelectorAll(".schedule-item")];
    if (!allItems.length) return;

    const firstItem = allItems[0];
    const lastItem = allItems[allItems.length - 1];
    const containerRect = schedContainer.getBoundingClientRect();
    const firstItemRect = firstItem.getBoundingClientRect();
    const lastItemRect = lastItem.getBoundingClientRect();

    // Align heart with the vertical line
    const firstSI = schedContainer.querySelector(".schedule-items");
    if (firstSI) {
      heart.style.left = (firstSI.getBoundingClientRect().left - containerRect.left) + "px";
    }

    // Don't start moving until first item enters the viewport
    if (firstItemRect.top >= window.innerHeight) {
      heart.style.top = (firstItemRect.top - containerRect.top + 14) + "px";
      return;
    }

    const scrollY = window.scrollY;
    const firstDocTop = firstItemRect.top + scrollY;
    const lastDocTop = lastItemRect.top + scrollY;
    const containerDocTop = containerRect.top + scrollY;

    // progress: 0 when first item enters viewport, 1 when last item is near center
    const scrollStart = firstDocTop - window.innerHeight;
    const scrollEnd = lastDocTop - window.innerHeight * 0.4;
    const progress = Math.max(0, Math.min(1, (scrollY - scrollStart) / (scrollEnd - scrollStart)));

    const heartDocTop = firstDocTop + progress * (lastDocTop - firstDocTop);
    heart.style.top = (heartDocTop - containerDocTop + 14) + "px";
  }

  window.addEventListener("scroll", updateHeart, { passive: true });
  updateHeart();
}

/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

[
  ".story-poem", ".story-invite", ".story-names",
  ".countdown-heading", ".countdown",
  ".venues .eyebrow", ".venues-heading",
  ".venue-card",
  ".timeline-section .eyebrow", ".timeline-section .section-heading", ".schedule-day",
  ".dresscode-section .eyebrow", ".dresscode-section .section-heading", ".dresscode-card",
  ".letter",
  ".quote-dove", ".quote-text", ".quote-ref",
  ".rsvp-section .eyebrow", ".rsvp-heading", ".rsvp-deadline", ".rsvp-form",
].forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add("reveal");
    if (i === 1) el.classList.add("delay-1");
    if (i === 2) el.classList.add("delay-2");
    revealObserver.observe(el);
  });
});

/* ── Footer ── */
set("#footerBride", w.bride);
set("#footerGroom", w.groom);
set("#footerDate", (w.dateShort || w.dateText || "").toUpperCase());
set("#letterNames", `${w.bride} & ${w.groom}`);

const brideLink = $("#footerBrideContact");
if (brideLink && w.brideContact) {
  brideLink.textContent = w.brideContact;
  brideLink.href = `tel:${w.brideContact.replace(/\s/g, "")}`;
}
const groomLink = $("#footerGroomContact");
if (groomLink && w.groomContact) {
  groomLink.textContent = w.groomContact;
  groomLink.href = `tel:${w.groomContact.replace(/\s/g, "")}`;
}
