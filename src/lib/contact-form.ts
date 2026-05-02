function bindMultiSelect(container: HTMLElement | null) {
  if (!container) return;
  container.querySelectorAll<HTMLButtonElement>('.pill').forEach((p) => {
    p.addEventListener('click', () => p.classList.toggle('is-active'));
  });
}
function bindSingleSelect(container: HTMLElement | null) {
  if (!container) return;
  const pills = container.querySelectorAll<HTMLButtonElement>('.pill');
  pills.forEach((p) => {
    p.addEventListener('click', () => {
      pills.forEach((x) => x.classList.remove('is-active'));
      p.classList.add('is-active');
    });
  });
}
function selected(container: HTMLElement | null): string[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLButtonElement>('.pill.is-active')).map((p) => p.textContent?.trim() ?? '');
}
const form = document.querySelector<HTMLFormElement>('#contactForm');
if (form) {
  const services = form.querySelector<HTMLElement>('.service-pills');
  const budget = form.querySelector<HTMLElement>('.budget-pills');
  bindMultiSelect(services);
  bindSingleSelect(budget);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get('name') ?? '');
    const email = String(fd.get('email') ?? '');
    const company = String(fd.get('company') ?? '');
    const timeline = String(fd.get('timeline') ?? '');
    const message = String(fd.get('message') ?? '');
    const consent = form.querySelector<HTMLInputElement>('input[name=consent]')?.checked ?? false;
    if (!consent) { alert('Please agree to the privacy policy.'); return; }
    const svcList = selected(services).join(', ') || 'Not specified';
    const budgetVal = selected(budget)[0] || 'Not specified';
    const body = [`Hi Media Pro, I'd like to discuss a project.`,``,`Name: ${name}`,`Email: ${email}`,company ? `Company: ${company}` : null,`Services: ${svcList}`,`Budget: ${budgetVal}`,timeline ? `Timeline: ${timeline}` : null,``,`Message:`,message].filter(Boolean).join('\n');
    const wa = `https://wa.me/6285129992227?text=${encodeURIComponent(body)}`;
    window.open(wa, '_blank', 'noopener');
    form.classList.add('submitted');
    const success = form.querySelector<HTMLElement>('.success-msg');
    if (success) success.classList.add('show');
  });
}

export {};
