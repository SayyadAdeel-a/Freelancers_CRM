import React from 'react';

export function JsonLd() {
  const websiteUrl = 'https://app.adeelsayyad.tech';
  
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Nudge CRM',
    url: websiteUrl,
    logo: `${websiteUrl}/logo.svg`,
    sameAs: [], // Add social profiles here
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Nudge CRM',
    operatingSystem: 'Web',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
    description: 'The industrial-grade CRM for modern freelancers. Manage clients, send stunning invoices, and track projects.',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '124',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Can I receive payments through Payoneer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nudge is a CRM, not a payment processor. Track your client relationships here, but handle payments via Payoneer, Wise, or your preferred platform.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why is it so simple compared to other CRMs?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We believe freelancers don\'t need enterprise complexity. No pipelines, no lead scoring, no bloat — just the essentials to manage your client relationships.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is my data secure?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely. Your data is stored with Firebase (Google Cloud) and protected with industry-standard encryption. We never sell or share your information.',
        },
      },
      {
        '@type': 'Question',
        name: 'What happens when I hit 10 clients on the Free plan?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You\'ll need to upgrade to Pro to add more clients. Your existing clients and data remain accessible — you just can\'t add new ones until you upgrade.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
