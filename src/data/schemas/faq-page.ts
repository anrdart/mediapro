export interface FaqEntry { question: string; answer: string; expandedAnswer?: string }

export function faqPageSchema(faqs: FaqEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.expandedAnswer ? `${f.answer} ${f.expandedAnswer}` : f.answer,
      },
    })),
  } as const;
}
