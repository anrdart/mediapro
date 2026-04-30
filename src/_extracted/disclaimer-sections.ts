export interface DisclaimerSection { id: string; num: string; title: string; contentHtml: string }

export const DISCLAIMER_HERO = {
  eyebrow: 'Disclaimer',
  title: 'Important <span class="accent">Disclaimer</span>',
  lede: 'Please read this carefully before engaging our digital marketing services or relying on information published on this website.',
  lastUpdated: '2026-04-12',
};

export const DISCLAIMER_SECTIONS: DisclaimerSection[] = [
  {
    id: 'general',
    num: '01',
    title: 'General Information',
    contentHtml: `<p>The information on this website (<strong>mediapro.work</strong>) is published in good faith and for general informational purposes only. Media Pro Creative Limited makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of any information.</p>
              <p>Any action you take based on the information you find on this website is strictly at your own risk. We will not be liable for any losses or damages in connection with the use of our website.</p>`,
  },
  {
    id: 'results',
    num: '02',
    title: 'No Guarantee of Results',
    contentHtml: `<p>Digital marketing is influenced by many variables outside our control — search engine algorithms, ad platform policies, market conditions, competition, your industry, your product, and consumer behavior. While we apply industry best practices and our 10+ years of experience to every campaign, <strong>we do not guarantee specific outcomes</strong> such as:</p>
              <ul>
                <li>Specific search engine rankings or page-one positions</li>
                <li>Exact traffic, click-through, or conversion rate numbers</li>
                <li>A defined return on ad spend (ROAS) or return on investment (ROI)</li>
                <li>A fixed number of leads, sales, or followers</li>
                <li>Permanent or unchanging results</li>
              </ul>
              <div class="callout"><strong>What we <em>do</em> commit to:</strong> applying our expertise diligently, communicating transparently, reporting honestly, and continuously optimizing your campaigns based on real data.</div>`,
  },
  {
    id: 'testimonials',
    num: '03',
    title: 'Testimonials &amp; Case Studies',
    contentHtml: `<p>The testimonials and case studies on our website reflect the real experiences of our clients. However, individual results vary based on industry, budget, market conditions, and execution. <strong>Past results are not guarantees of future performance.</strong></p>
              <p>Some testimonials may have been edited for length or clarity. We have written consent from each client featured.</p>`,
  },
  {
    id: 'third-party',
    num: '04',
    title: 'Third-Party Platforms',
    contentHtml: `<p>Many of our services involve third-party platforms — Google, Meta (Facebook/Instagram), TikTok, LinkedIn, and others. These platforms have their own terms, policies, and pricing structures that change without notice. Media Pro:</p>
              <ul>
                <li>Has no control over platform policy changes, account suspensions, or algorithm updates</li>
                <li>Is not responsible for fluctuations in advertising costs (CPC, CPM)</li>
                <li>Cannot prevent third-party platforms from rejecting ads, content, or accounts</li>
                <li>Is not liable for any data loss or service interruptions caused by these platforms</li>
              </ul>`,
  },
  {
    id: 'external',
    num: '05',
    title: 'External Links',
    contentHtml: `<p>Our website may contain links to external sites that are not provided or maintained by Media Pro. We do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites. The presence of a link does not imply endorsement.</p>`,
  },
  {
    id: 'professional',
    num: '06',
    title: 'Professional Advice',
    contentHtml: `<p>The content on this website — blog posts, guides, articles, social media content — is for educational and informational purposes only. It is <strong>not</strong> a substitute for professional legal, financial, accounting, or tax advice. Always consult a qualified professional for advice specific to your situation.</p>`,
  },
  {
    id: 'earnings',
    num: '07',
    title: 'Earnings &amp; Income',
    contentHtml: `<p>Any references to potential earnings, revenue increases, or business growth in our marketing materials, case studies, or proposals are illustrative only. They are not promises or guarantees of similar results for your business. Your results depend on your effort, your offer, your market, and many other factors.</p>`,
  },
  {
    id: 'errors',
    num: '08',
    title: 'Errors &amp; Omissions',
    contentHtml: `<p>While we strive to keep the information on this website accurate and up to date, we make no warranty that this site is error-free. If you spot something incorrect, please email <a href="mailto:admin@mediapro.work">admin@mediapro.work</a> and we'll review it promptly.</p>`,
  },
  {
    id: 'changes',
    num: '09',
    title: 'Changes to Disclaimer',
    contentHtml: `<p>We reserve the right to update this Disclaimer at any time. Changes take effect immediately upon publication on this page. The "Last updated" date at the top reflects the most recent revision.</p>
              <p>Questions? Email us at <a href="mailto:admin@mediapro.work">admin@mediapro.work</a>.</p>`,
  },
];
