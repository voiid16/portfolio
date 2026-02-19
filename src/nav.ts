const NAV_HEIGHT = 72;

export function navScrollTo(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT,
    behavior: "smooth",
  });
}

export function initNav(): void {
  // Nav link click → smooth scroll
  document.querySelectorAll<HTMLAnchorElement>(".nav-links a").forEach((a) => {
    a.addEventListener("click", (e) => {
      const sec =
        a.dataset.section ||
        (a.getAttribute("href") ?? "").replace("#", "");
      if (sec && document.getElementById(sec)) {
        e.preventDefault();
        navScrollTo(sec);
      }
    });
  });

  // CTA buttons smooth scroll
  document.querySelectorAll<HTMLElement>(".btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const href = btn.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        navScrollTo(href.slice(1));
      }
    });
  });

  // Logo click → scroll home
  document.getElementById("nav-logo")?.addEventListener("click", () => {
    navScrollTo("home");
  });

  // Active nav highlight on scroll
  const sections = ["home", "education", "skills", "projects", "experience", "contact"];
  const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav-links a[data-section]");

  function updateActiveNav(): void {
    const scrollY = window.scrollY + NAV_HEIGHT + 40;
    let current = sections[0];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) current = id;
    });
    navLinks.forEach((a) => {
      a.classList.toggle("active", a.dataset.section === current);
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();
}
