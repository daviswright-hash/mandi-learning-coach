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

const FORM_ENDPOINT = "https://formsubmit.co/ajax/1ae1dd38406dc0b8292f9e8cf05f7352";

const setNote = (el, text, kind) => {
  if (!el) return;
  el.textContent = text;
  el.classList.add("show");
  el.classList.toggle("is-ok", kind === "ok");
  el.classList.toggle("is-fail", kind === "fail");
};

const deliverNotice = async ({ subject, fields, button, noteEl }) => {
  const original = button ? button.textContent : "";
  if (button) {
    button.disabled = true;
    button.textContent = "Sending…";
  }
  const payload = {
    _subject: subject,
    _template: "table",
    _captcha: "false",
    _cc: "orangemandimack@yahoo.com",
    _url: "https://sceniccitylearning.com/",
    ...fields,
  };
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    const ok = res.ok && String(result.success) !== "false";
    if (!ok) throw new Error(result.message || "not delivered");
    setNote(
      noteEl,
      "Sent. Mandi has this in email. If it’s urgent, also text (929) 256-3772.",
      "ok"
    );
    return true;
  } catch {
    setNote(
      noteEl,
      "The form did not go through. Please text (929) 256-3772 or email orangemandimack@yahoo.com so Mandi doesn’t miss you.",
      "fail"
    );
    return false;
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = original;
    }
  }
};

const recForm = document.getElementById("recommend");
const recNote = document.getElementById("recNote");
const recError = document.getElementById("recError");
if (recForm) {
  recForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(recForm);
    if (String(data.get("company") || "").trim()) return;
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
    const sent = await deliverNotice({
      subject: `Scenic City Learning recommendation — ${name}`,
      fields: {
        Name: name,
        Role: role,
        "Child’s grade": String(data.get("grade") || ""),
        Town: String(data.get("town") || ""),
        email,
        "Publish on website": publish,
        message: quote,
      },
      button: recForm.querySelector('button[type="submit"]'),
      noteEl: recNote,
    });
    if (sent) recForm.reset();
  });
}

const form = document.getElementById("intake");
const note = document.getElementById("formNote");
const error = document.getElementById("formError");
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    if (String(data.get("company") || "").trim()) return;
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
    const sent = await deliverNotice({
      subject: `Scenic City Learning inquiry — ${grade}`,
      fields: {
        Parent: parent,
        email,
        Phone: String(data.get("phone") || ""),
        Child: String(data.get("child") || ""),
        Grade: grade,
        "Support needed": needs.join(", ") || "not specified",
        "Days that could work": String(data.get("days") || ""),
        Location: "Mandi's home in Red Bank",
        message: String(data.get("message") || ""),
      },
      button: form.querySelector('button[type="submit"]'),
      noteEl: note,
    });
    if (sent) form.reset();
  });
}
