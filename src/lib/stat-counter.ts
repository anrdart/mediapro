function parseTarget(str: string) {
  const m = str.match(/^([\d.]+)([KkMm]?)([+]?)$/);
  if (!m) return { value: parseFloat(str) || 0, suffix: '', plus: false, decimals: 0 };
  return {
    value: parseFloat(m[1]),
    suffix: m[2] || '',
    plus: m[3] === '+',
    decimals: (m[1].split('.')[1] || '').length,
  };
}
document.querySelectorAll<HTMLElement>('[data-stat-target]').forEach((el) => {
  const target = el.dataset.statTarget;
  if (!target) return;
  const { value, suffix, plus, decimals } = parseTarget(target);
  let started = false;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !started) {
          started = true;
          const start = performance.now();
          const dur = 1600;
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            const num = (value * eased).toFixed(decimals);
            el.textContent = num + suffix + (plus ? '+' : '');
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      }
    },
    { threshold: 0.4 }
  );
  io.observe(el);
});

export {};
