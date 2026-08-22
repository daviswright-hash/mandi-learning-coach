const toggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

const form = document.getElementById("intake");
const note = document.getElementById("formNote");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const needs = data.getAll("need");
    const lines = [
      `Parent: ${data.get("parent") || ""}`,
      `Email: ${data.get("email") || ""}`,
      `Phone: ${data.get("phone") || ""}`,
      `Grade: ${data.get("grade") || ""}`,
      `Support needed: ${needs.join(", ") || "not specified"}`,
      `Preferred place: ${data.get("place") || ""}`,
      "",
      data.get("message") || "",
    ];
    const subject = encodeURIComponent(
      `Learning coach inquiry — ${data.get("grade") || "K-5"}`
    );
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:orangemandimack@yahoo.com?subject=${subject}&body=${body}`;
    if (note) note.classList.add("show");
  });
}
