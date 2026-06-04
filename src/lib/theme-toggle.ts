type Theme = 'dark' | 'light';

function getCurrentTheme(): Theme {
  return (document.documentElement.getAttribute('data-theme') as Theme) || 'light';
}

function persist(theme: Theme) {
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // localStorage may be blocked in private mode — ignore
  }
}

function syncThemeImages(theme: Theme) {
  const key = theme === 'dark' ? 'srcDark' : 'srcLight';
  document.querySelectorAll<HTMLImageElement>('.theme-img').forEach((img) => {
    const src = img.dataset[key];
    if (src && img.src !== src) img.src = src;
  });
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  syncThemeImages(theme);
  persist(theme);
}

function setTheme(theme: Theme) {
  // Use View Transitions API if available — gives a smooth crossfade for free
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typeof document.startViewTransition === 'function' && !reducedMotion) {
    document.startViewTransition(() => applyTheme(theme));
    return;
  }

  // Fallback: temporary class triggers a wide-net transition rule (see tokens.css)
  const html = document.documentElement;
  html.classList.add('theme-transitioning');
  applyTheme(theme);
  window.setTimeout(() => html.classList.remove('theme-transitioning'), 400);
}

const button = document.getElementById('themeToggle');
if (button) {
  button.addEventListener('click', () => {
    const next: Theme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
    button.setAttribute('aria-pressed', String(next === 'dark'));
  });

  // Initial state
  const initial = getCurrentTheme();
  button.setAttribute('aria-pressed', String(initial === 'dark'));
  syncThemeImages(initial);
}

// Sync across open tabs
window.addEventListener('storage', (e) => {
  if (e.key !== 'theme' || !e.newValue) return;
  const next = e.newValue as Theme;
  document.documentElement.setAttribute('data-theme', next);
  syncThemeImages(next);
  button?.setAttribute('aria-pressed', String(next === 'dark'));
});

export {};
