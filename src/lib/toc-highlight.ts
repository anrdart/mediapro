const links = document.querySelectorAll<HTMLAnchorElement>('.toc a[href^="#"]');
const sections = document.querySelectorAll<HTMLElement>('.prose section[id]');
if (links.length && sections.length) {
  const map = new Map<string, HTMLAnchorElement>();
  links.forEach((a) => { const id = a.getAttribute('href')?.slice(1); if (id) map.set(id, a); });
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.remove('is-active'));
          map.get(e.target.id)?.classList.add('is-active');
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
  );
  sections.forEach((s) => io.observe(s));
}
