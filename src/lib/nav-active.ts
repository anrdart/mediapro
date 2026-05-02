const links = Array.from(
  document.querySelectorAll<HTMLAnchorElement>('.nav-links a, .sidebar-links a')
);

function setActive(hash: string) {
  links.forEach((link) => {
    const href = link.getAttribute('href') ?? '';
    const linkHash = href.includes('#') ? '#' + href.split('#')[1] : '';
    // Home: no hash, href is '/' or ends with '/'
    const isHome = !hash && (href === '/' || href === '' || (!href.includes('#') && !href.includes('.')));
    const isSection = hash && linkHash === hash;
    if (isHome || isSection) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

// Initial state from URL hash
setActive(window.location.hash);

// Update on hash change (when clicking nav links)
window.addEventListener('hashchange', () => setActive(window.location.hash));

// Update on scroll via IntersectionObserver
const sectionIds = ['top', 'about', 'services', 'contact'];
const sections = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean) as HTMLElement[];

if (sections.length) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const hash = entry.target.id === 'top' ? '' : `#${entry.target.id}`;
          setActive(hash);
          break;
        }
      }
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );
  sections.forEach((el) => io.observe(el));
}

export {};
