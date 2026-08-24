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
