document.querySelectorAll<HTMLButtonElement>('.faq-q').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    if (!item) return;
    const wasOpen = item.classList.contains('is-open');
    item.classList.toggle('is-open', !wasOpen);
    btn.setAttribute('aria-expanded', String(!wasOpen));
  });
});

export {};
