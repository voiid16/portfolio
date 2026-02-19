export function initReveal(): void {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const parent = entry.target.parentElement;
      if (!parent) return;
      const siblings = Array.from(
        parent.querySelectorAll<HTMLElement>(".reveal:not(.visible)")
      );
      const idx = siblings.indexOf(entry.target as HTMLElement);
      setTimeout(() => {
        entry.target.classList.add("visible");
      }, Math.max(0, idx) * 90);
      observer.unobserve(entry.target);
    });
  });

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}
