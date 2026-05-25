import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class Seo {

  constructor(
    private meta: Meta,
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  setPageMeta(config: {
    title: string;
    description: string;
    keywords: string;
    image?: string;
    url?: string;
    type?: string;
  }) {
    this.titleService.setTitle(config.title);

    // Clear existing meta tags
    this.meta.removeTag("name='description'");
    this.meta.removeTag("name='keywords'");
    this.meta.removeTag("property='og:title'");
    this.meta.removeTag("property='og:description'");
    this.meta.removeTag("property='og:image'");
    this.meta.removeTag("property='og:url'");
    this.meta.removeTag("name='twitter:title'");
    this.meta.removeTag("name='twitter:description'");
    this.meta.removeTag("name='twitter:image'");

    this.meta.addTags([
      // Basic Meta
      { name: 'description', content: config.description },
      { name: 'keywords', content: config.keywords },
      { name: 'author', content: 'QSoft Group' },
      { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
      { name: 'googlebot', content: 'index, follow' },
      { name: 'bingbot', content: 'index, follow' },

      // Open Graph (Facebook, LinkedIn, etc.)
      { property: 'og:title', content: config.title },
      { property: 'og:description', content: config.description },
      { property: 'og:type', content: config.type || 'website' },
      { property: 'og:url', content: config.url || 'https://qsoft-group.com' },
      { property: 'og:image', content: config.image || 'https://qsoft-group.com/images/qsoft-og.jpg' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:site_name', content: 'QSoft Group' },
      { property: 'og:locale', content: 'en_KE' },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@qsoftgroup' },
      { name: 'twitter:creator', content: '@qsoftgroup' },
      { name: 'twitter:title', content: config.title },
      { name: 'twitter:description', content: config.description },
      { name: 'twitter:image', content: config.image || 'https://qsoft-group.com/images/qsoft-og.jpg' },

      // Geo Tags (Karen, Nairobi)
      { name: 'geo.region', content: 'KE-110' },
      { name: 'geo.placename', content: 'Karen, Nairobi, Kenya' },
      { name: 'geo.position', content: '-1.320;36.707' },
      { name: 'ICBM', content: '-1.320, 36.707' },
    ]);
  }

  setOrganizationSchema() {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'QSoft Group',
      'alternateName': 'QSoft',
      'description': 'Enterprise software development company based in Karen, Nairobi. Custom software, government solutions, fintech, and IoT systems.',
      'url': 'https://qsoft-group.com',
      'logo': 'https://qsoft-group.com/images/qsoft-logo.png',
      'image': 'https://qsoft-group.com/images/qsoft-og.jpg',
      'foundingDate': '2009',
      'foundingLocation': 'Karen, Nairobi, Kenya',
      'email': 'info@qsoft-group.com',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Karen',
        'addressLocality': 'Nairobi',
        'addressRegion': 'Nairobi County',
        'postalCode': '00502',
        'addressCountry': 'KE'
      },
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+254-700-000000',
        'contactType': 'sales',
        'availableLanguage': ['English', 'Swahili'],
        'areaServed': ['KE', 'TZ', 'UG', 'RW', 'EA']
      },
      'sameAs': [
        'https://www.linkedin.com/company/qsoft-group',
        'https://twitter.com/qsoftgroup',
        'https://www.facebook.com/qsoftgroup',
        'https://www.instagram.com/qsoftgroup'
      ],
      'knowsAbout': [
        'Custom Software Development',
        'Government Software Solutions',
        'Fintech Solutions',
        'IoT Systems',
        'Mobile App Development',
        'Web Application Development',
        'ERP Systems',
        'Revenue Collection Systems'
      ]
    };

    this.removeExistingSchema();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  setLocalBusinessSchema() {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': 'QSoft Group',
      'image': 'https://qsoft-group.com/images/qsoft-logo.png',
      'description': 'Enterprise software development company in Karen, Nairobi offering custom software, government solutions, fintech, and IoT systems.',
      'url': 'https://qsoft-group.com',
      'telephone': '+254-700-000000',
      'email': 'info@qsoft-group.com',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Karen',
        'addressLocality': 'Nairobi',
        'addressRegion': 'Nairobi County',
        'postalCode': '00502',
        'addressCountry': 'KE'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': '-1.320',
        'longitude': '36.707'
      },
      'openingHoursSpecification': {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        'opens': '08:00',
        'closes': '17:00'
      },
      'priceRange': '$$',
      'areaServed': 'East Africa'
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  setBreadcrumbSchema(items: { name: string; url: string }[]) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': item.url
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  private removeExistingSchema() {
    const existingScripts = document.head.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());
  }
}