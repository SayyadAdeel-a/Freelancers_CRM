import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/api/',
        '/_next/',
        '/static/',
        '/login',
        '/signup',
      ],
    },
    sitemap: 'https://app.adeelsayyad.tech/sitemap.xml',
  };
}
