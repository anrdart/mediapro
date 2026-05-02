const cats = document.querySelectorAll<HTMLButtonElement>('.faq-cat');
const items = document.querySelectorAll<HTMLElement>('.faq-item');
cats.forEach((c) => {
  c.addEventListener('click', () => {
    cats.forEach((x) => x.classList.remove('is-active'));
    c.classList.add('is-active');
    const cat = c.dataset.cat;
    items.forEach((it) => {
      (it as HTMLElement).style.display = (cat === 'all' || it.dataset.cat === cat) ? '' : 'none';
    });
  });
});

export {};
