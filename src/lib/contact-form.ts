const LIMITS = { name: 100, email: 254, company: 100, timeline: 100, message: 2000 };

function cap(s: string, max: number): string {
  return s.trim().slice(0, max);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]{1,64}@[^\s@]{1,255}$/.test(email);
}

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
    const name    = cap(String(fd.get('name')     ?? ''), LIMITS.name);
    const email   = cap(String(fd.get('email')    ?? ''), LIMITS.email);
    const company = cap(String(fd.get('company')  ?? ''), LIMITS.company);
    const timeline = cap(String(fd.get('timeline') ?? ''), LIMITS.timeline);
    const message  = cap(String(fd.get('message') ?? ''), LIMITS.message);
    const consent = form.querySelector<HTMLInputElement>('input[name=consent]')?.checked ?? false;
    if (!consent) { alert('Please agree to the privacy policy.'); return; }
    if (!name) { alert('Please enter your name.'); return; }
    if (!isValidEmail(email)) { alert('Please enter a valid email address.'); return; }
    const svcList  = selected(services).join(', ') || 'Not specified';
    const budgetVal = selected(budget)[0] || 'Not specified';
    const body = [
      `Hi Media Pro, I'd like to discuss a project.`, ``,
      `Name: ${name}`,
      `Email: ${email}`,
      company  ? `Company: ${company}`   : null,
      `Services: ${svcList}`,
      `Budget: ${budgetVal}`,
      timeline ? `Timeline: ${timeline}` : null,
      ``, `Message:`, message,
    ].filter(Boolean).join('\n');
    const wa = `https://wa.me/6285129992227?text=${encodeURIComponent(body)}`;
    window.open(wa, '_blank', 'noopener,noreferrer');
    form.classList.add('submitted');
    const success = form.querySelector<HTMLElement>('.success-msg');
    if (success) success.classList.add('show');
  });
}

export {};
