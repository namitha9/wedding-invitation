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
set("#openingDate", w.dateText || "");

$("#openButton").addEventListener("click", () => {
  $("#opening").classList.add("open");
  setTimeout(() => {
    $("#opening").classList.add("hidden");
    $("#site").classList.remove("hidden");
    window.scrollTo(0, 0);
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
function venueMedallionSVG(venue, location) {
  return `
    <svg viewBox="0 0 260 310" xmlns="http://www.w3.org/2000/svg" class="venue-frame-svg" aria-hidden="true">
      <defs>
        <filter id="mShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.07)"/>
        </filter>
      </defs>
      <!-- Badge background -->
      <path d="M130,14 C162,11 204,26 228,54 C246,74 255,100 254,128 L252,178 C250,216 235,250 210,270 C192,284 162,298 130,304 C98,298 68,284 50,270 C25,250 10,216 8,178 L6,128 C5,100 14,74 32,54 C56,26 98,11 130,14 Z"
            fill="#f5f0e6" stroke="#ccc5b0" stroke-width="1" filter="url(#mShadow)"/>
      <!-- Inner border ring -->
      <path d="M130,26 C160,23 199,37 221,63 C237,81 246,105 245,131 L243,177 C241,212 228,243 205,261 C188,274 161,287 130,292 C99,287 72,274 55,261 C32,243 19,212 17,177 L15,131 C14,105 23,81 39,63 C61,37 100,23 130,26 Z"
            fill="none" stroke="#ccc5b0" stroke-width="0.6"/>
      <!-- Top botanical cluster -->
      <g fill="#c8c0a8">
        <ellipse cx="130" cy="17" rx="6" ry="3.5" transform="rotate(-90 130 17)"/>
        <circle cx="120" cy="21" r="3.5"/><circle cx="140" cy="21" r="3.5"/>
        <circle cx="112" cy="28" r="2.5"/><circle cx="148" cy="28" r="2.5"/>
        <ellipse cx="107" cy="38" rx="5" ry="2.5" transform="rotate(-40 107 38)"/>
        <ellipse cx="153" cy="38" rx="5" ry="2.5" transform="rotate(40 153 38)"/>
      </g>
      <!-- Left botanical -->
      <g fill="none" stroke="#ccc5b0" stroke-width="0.7">
        <path d="M14 120 C6 115 0 108 4 102" stroke-linecap="round"/>
        <path d="M11 145 C2 142 -2 134 3 129" stroke-linecap="round"/>
        <ellipse cx="3" cy="104" rx="6" ry="3" fill="#c8c0a8" stroke="none" transform="rotate(-30 3 104)"/>
        <ellipse cx="1" cy="130" rx="6" ry="3" fill="#c8c0a8" stroke="none" transform="rotate(-20 1 130)"/>
      </g>
      <!-- Right botanical (mirror) -->
      <g fill="none" stroke="#ccc5b0" stroke-width="0.7">
        <path d="M246 120 C254 115 260 108 256 102" stroke-linecap="round"/>
        <path d="M249 145 C258 142 262 134 257 129" stroke-linecap="round"/>
        <ellipse cx="257" cy="104" rx="6" ry="3" fill="#c8c0a8" stroke="none" transform="rotate(30 257 104)"/>
        <ellipse cx="259" cy="130" rx="6" ry="3" fill="#c8c0a8" stroke="none" transform="rotate(20 259 130)"/>
      </g>
      <!-- Bottom botanical -->
      <g fill="#c8c0a8">
        <circle cx="130" cy="300" r="3.5"/>
        <circle cx="118" cy="294" r="2.5"/><circle cx="142" cy="294" r="2.5"/>
        <ellipse cx="108" cy="284" rx="5" ry="2.5" transform="rotate(40 108 284)"/>
        <ellipse cx="152" cy="284" rx="5" ry="2.5" transform="rotate(-40 152 284)"/>
      </g>
      <!-- Side flowers at waist -->
      <g fill="#c8c0a8">
        <circle cx="6" cy="165" r="4"/><circle cx="2" cy="158" r="2.5"/><circle cx="2" cy="172" r="2.5"/>
        <circle cx="254" cy="165" r="4"/><circle cx="258" cy="158" r="2.5"/><circle cx="258" cy="172" r="2.5"/>
      </g>
    </svg>
    <div class="venue-medallion-text">
      <p class="venue-name">${venue.toUpperCase()}</p>
      <p class="venue-loc"><em>${location}</em></p>
    </div>
  `;
}

if (w.events) {
  setHtml("#venueCards", w.events.map((ev) => `
    <div class="venue-card">
      <div class="venue-arch">
        <p class="venue-card-label">${ev.label.toUpperCase()}</p>
        <div class="venue-medallion">
          ${venueMedallionSVG(ev.venue, ev.location)}
        </div>
      </div>
      <div class="venue-info">
        <p class="venue-date">${ev.date}</p>
        <p class="venue-time">${ev.time}</p>
        <a href="${ev.mapUrl}" target="_blank" rel="noreferrer" class="venue-directions">Get Directions ↗</a>
      </div>
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
