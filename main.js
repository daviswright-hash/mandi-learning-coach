const header = document.getElementById("siteHeader");
if (header) {
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

const toggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
const closeMenu = () => {
  if (!nav || !toggle) return;
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open menu");
};
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const contact = document.getElementById("contact");
const mobileCta = document.getElementById("mobileCta");
if (contact && mobileCta && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    ([entry]) => {
      mobileCta.classList.toggle("is-hidden", entry.isIntersecting);
    },
    { threshold: 0.28 }
  );
  io.observe(contact);
}

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const testimonialList = document.getElementById("testimonialList");
if (testimonialList) {
  const emptyMarkup = `
    <div class="review-empty">
      <strong>No public notes yet — you can be the first.</strong>
      <p>Use the form to send a recommendation. Mandi reads every message. If you check the box, your first name and words can appear here.</p>
    </div>`;
  fetch("testimonials.json", { cache: "no-store" })
    .then((res) => (res.ok ? res.json() : Promise.reject()))
    .then((data) => {
      const items = Array.isArray(data.items) ? data.items : [];
      if (!items.length) {
        testimonialList.innerHTML = emptyMarkup;
        return;
      }
      testimonialList.innerHTML = items
        .map((item) => {
          const quote = escapeHtml(item.quote || "");
          const name = escapeHtml(item.name || "A family");
          const detail = escapeHtml(item.detail || "");
          return `<article class="review-card">
            <p class="review-mark" aria-hidden="true">“</p>
            <blockquote>${quote}</blockquote>
            <p class="review-meta">${name}${detail ? `<span>${detail}</span>` : ""}</p>
          </article>`;
        })
        .join("");
    })
    .catch(() => {
      testimonialList.innerHTML = emptyMarkup;
    });
}

const recForm = document.getElementById("recommend");
const recNote = document.getElementById("recNote");
const recError = document.getElementById("recError");
if (recForm) {
  recForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(recForm);
    const name = String(data.get("name") || "").trim();
    const role = String(data.get("role") || "").trim();
    const email = String(data.get("email") || "").trim();
    const quote = String(data.get("quote") || "").trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !role || !validEmail || !quote) {
      if (recError) {
        recError.hidden = false;
        recError.focus();
      }
      return;
    }
    if (recError) recError.hidden = true;
    const publish = data.get("publish") === "yes" ? "Yes — may publish first name and note" : "No — keep this private";
    const lines = [
      `Name: ${name}`,
      `I am a: ${role}`,
      `Child’s grade: ${data.get("grade") || ""}`,
      `Town: ${data.get("town") || ""}`,
      `Email: ${email}`,
      `Publish on website: ${publish}`,
      "",
      quote,
    ];
    const message = lines.join("\n");
    const subject = `Scenic City Learning recommendation — ${name}`;
    try {
      await navigator.clipboard.writeText(
        `${subject}\n\n${message}\n\norangemandimack@yahoo.com`
      );
    } catch {
      /* clipboard may be blocked; mailto still runs */
    }
    window.location.href = `mailto:orangemandimack@yahoo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    if (recNote) recNote.classList.add("show");
  });
}

const form = document.getElementById("intake");
const note = document.getElementById("formNote");
const error = document.getElementById("formError");
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const parent = String(data.get("parent") || "").trim();
    const email = String(data.get("email") || "").trim();
    const grade = String(data.get("grade") || "").trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!parent || !validEmail || !grade) {
      if (error) {
        error.hidden = false;
        error.focus();
      }
      return;
    }
    if (error) error.hidden = true;
    const needs = data.getAll("need");
    const lines = [
      `Parent: ${parent}`,
      `Email: ${email}`,
      `Phone: ${data.get("phone") || ""}`,
      `Child: ${data.get("child") || ""}`,
      `Grade: ${grade}`,
      `Support needed: ${needs.join(", ") || "not specified"}`,
      `Days that could work: ${data.get("days") || ""}`,
      `Location: Mandi's home in Red Bank`,
      "",
      data.get("message") || "",
    ];
    const message = lines.join("\n");
    const subject = `Scenic City Learning inquiry — ${grade}`;
    try {
      await navigator.clipboard.writeText(
        `${subject}\n\n${message}\n\norangemandimack@yahoo.com`
      );
    } catch {
      /* clipboard may be blocked; mailto still runs */
    }
    window.location.href = `mailto:orangemandimack@yahoo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    if (note) note.classList.add("show");
  });
}
