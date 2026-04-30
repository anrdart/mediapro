export interface TermsSection { id: string; num: string; title: string; contentHtml: string }

export const TERMS_HERO = {
  eyebrow: 'Legal',
  title: 'Terms of Service &amp; <span class="accent">Privacy Policy</span>',
  lede: 'The agreement between you and Media Pro Creative Limited when using our website, services, and digital products. Written in plain language so there are no surprises.',
  lastUpdated: '2026-04-12',
};

export const TERMS_SECTIONS: TermsSection[] = [
  {
    id: 'acceptance',
    num: '01',
    title: 'Acceptance of Terms',
    contentHtml: `<p>By accessing or using <strong>mediapro.work</strong> and any services provided by Media Pro Creative Limited ("Media Pro," "we," "us," or "our"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use our services.</p>
              <p>These Terms apply to all visitors, clients, and users of our website and digital marketing services, including but not limited to SEO, Google Ads, Meta Ads, Web Development, and Consulting Services.</p>`,
  },
  {
    id: 'services',
    num: '02',
    title: 'Services Provided',
    contentHtml: `<p>Media Pro provides professional digital marketing services to businesses and organizations. The scope, deliverables, and timeline of each engagement are defined in a separate Service Agreement (SA) or Statement of Work (SOW) signed by both parties.</p>
              <p>Our services include but are not limited to:</p>
              <ul>
                <li>Web Development &amp; Design</li>
                <li>Search Engine Optimization (SEO)</li>
                <li>Google Ads campaign management</li>
                <li>Meta Ads (Facebook &amp; Instagram) campaign management</li>
                <li>Social media marketing and content creation</li>
                <li>Email marketing and automation</li>
                <li>Analytics, reporting, and consulting services</li>
              </ul>`,
  },
  {
    id: 'data',
    num: '03',
    title: 'Data We Collect',
    contentHtml: `<p>We collect information you provide directly to us when you fill out a contact form, request a consultation, or sign a service agreement. This may include:</p>
              <ul>
                <li><strong>Identity data:</strong> Full name, company name, job title</li>
                <li><strong>Contact data:</strong> Email address, phone number, mailing address</li>
                <li><strong>Project data:</strong> Business goals, budget, timeline, brand assets</li>
                <li><strong>Technical data:</strong> IP address, browser type, device information, pages visited</li>
                <li><strong>Marketing data:</strong> Communication preferences, response to campaigns</li>
              </ul>
              <div class="callout"><strong>Note:</strong> We do <strong>not</strong> sell your personal data to third parties. Ever.</div>`,
  },
  {
    id: 'usage',
    num: '04',
    title: 'How We Use Data',
    contentHtml: `<p>We use the information we collect to:</p>
              <ul>
                <li>Deliver the services you've contracted us for</li>
                <li>Communicate about your project and respond to inquiries</li>
                <li>Send relevant marketing communications (with your consent)</li>
                <li>Improve our website, services, and client experience</li>
                <li>Comply with legal obligations and protect our rights</li>
                <li>Analyze trends and measure the effectiveness of our campaigns</li>
              </ul>`,
  },
  {
    id: 'cookies',
    num: '05',
    title: 'Cookies &amp; Tracking',
    contentHtml: `<p>Our website uses cookies and similar tracking technologies to improve user experience, analyze traffic, and serve personalized ads. We use:</p>
              <ul>
                <li><strong>Essential cookies</strong> — required for the site to function</li>
                <li><strong>Analytics cookies</strong> — Google Analytics 4, Meta Pixel</li>
                <li><strong>Advertising cookies</strong> — Google Ads, Meta Ads remarketing</li>
                <li><strong>Preference cookies</strong> — to remember your choices</li>
              </ul>
              <p>You can control cookie settings through your browser. Disabling cookies may limit certain website features.</p>`,
  },
  {
    id: 'sharing',
    num: '06',
    title: 'Sharing &amp; Third Parties',
    contentHtml: `<p>We share data only with trusted partners who help us operate our business, including hosting providers, ad platforms (Google, Meta), analytics tools, and payment processors. All partners are contractually bound to protect your data and use it only for the purposes we specify.</p>
              <p>We may also disclose information when legally required, to protect our rights, or in connection with a business transaction such as a merger or acquisition.</p>`,
  },
  {
    id: 'security',
    num: '07',
    title: 'Data Security',
    contentHtml: `<p>We implement industry-standard security measures including SSL/TLS encryption, secure password hashing, restricted access controls, and regular security audits to protect your data against unauthorized access, alteration, or disclosure.</p>
              <p>However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but commit to notifying affected users within 72 hours of discovering a breach affecting their personal data.</p>`,
  },
  {
    id: 'rights',
    num: '08',
    title: 'Your Rights',
    contentHtml: `<p>Depending on your jurisdiction, you have the right to:</p>
              <ul>
                <li><strong>Access</strong> the personal data we hold about you</li>
                <li><strong>Correct</strong> inaccurate or incomplete data</li>
                <li><strong>Delete</strong> your data ("right to be forgotten")</li>
                <li><strong>Restrict</strong> or object to certain processing</li>
                <li><strong>Receive a copy</strong> of your data in a portable format</li>
                <li><strong>Withdraw consent</strong> for marketing communications at any time</li>
              </ul>
              <p>To exercise any of these rights, email us at <a href="mailto:admin@mediapro.work">admin@mediapro.work</a>. We will respond within 30 days.</p>`,
  },
  {
    id: 'payments',
    num: '09',
    title: 'Payments &amp; Refunds',
    contentHtml: `<p>Service fees, payment schedules, and refund terms are detailed in your individual Service Agreement. Generally:</p>
              <ul>
                <li>A 50% deposit is required before work commences on most engagements</li>
                <li>All fees are quoted and invoiced in <strong>US Dollars (USD)</strong></li>
                <li>Invoices are due within 14 days of issue (NET-14)</li>
                <li>Late payments may incur a 1.5% monthly interest charge</li>
                <li>We accept international bank transfer (SWIFT/Wise), credit card via Stripe, and PayPal</li>
                <li>Ad spend is billed separately and paid directly to the ad platform on your card</li>
                <li>Refunds for work already performed are not available; unused retainer balances may be credited or refunded at our discretion</li>
              </ul>`,
  },
  {
    id: 'ip',
    num: '10',
    title: 'Intellectual Property',
    contentHtml: `<p>All content on this website — including text, graphics, logos, code, and design — is the property of Media Pro Creative Limited or its licensors and is protected by international copyright laws.</p>
              <p>Upon full payment, deliverables created specifically for your project (websites, ad creatives, content) become your property. Pre-existing tools, frameworks, and methodologies remain ours.</p>`,
  },
  {
    id: 'liability',
    num: '11',
    title: 'Limitation of Liability',
    contentHtml: `<p>To the fullest extent permitted by law, Media Pro shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, arising from your use of our services or website.</p>
              <p>Our total liability for any claim shall not exceed the amount you paid us for the specific service giving rise to the claim in the 12 months preceding it.</p>`,
  },
  {
    id: 'changes',
    num: '12',
    title: 'Changes to Terms',
    contentHtml: `<p>We may update these Terms from time to time. Material changes will be communicated via email or a prominent notice on our website at least 14 days before taking effect. Continued use of our services after the effective date constitutes acceptance.</p>`,
  },
  {
    id: 'contact',
    num: '13',
    title: 'Contact Us',
    contentHtml: `<p>Questions about these Terms or our Privacy Policy? Reach out:</p>
              <ul>
                <li><strong>Email:</strong> <a href="mailto:admin@mediapro.work">admin@mediapro.work</a></li>
                <li><strong>WhatsApp:</strong> <a href="https://wa.me/6285129992227" rel="noopener noreferrer">Send a message</a></li>
                <li><strong>Mail:</strong> Media Pro Creative Limited (remote-first, global)</li>
              </ul>`,
  },
];
