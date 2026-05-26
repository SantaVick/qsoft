import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {

  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  setPageMeta(data: PageMeta) {
    // Title
    this.title.setTitle(data.title);

    // Basic
    this.meta.updateTag({ name: 'description', content: data.description });
    if (data.keywords) {
      this.meta.updateTag({ name: 'keywords', content: data.keywords });
    }
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: data.title });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    this.meta.updateTag({ property: 'og:type', content: data.type || 'website' });
    if (data.url) {
      this.meta.updateTag({ property: 'og:url', content: data.url });
      this.setCanonical(data.url);
    }
    if (data.image) {
      this.meta.updateTag({ property: 'og:image', content: data.image });
      this.meta.updateTag({ property: 'og:image:width', content: '1200' });
      this.meta.updateTag({ property: 'og:image:height', content: '630' });
    }

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: data.title });
    this.meta.updateTag({ name: 'twitter:description', content: data.description });
    if (data.image) {
      this.meta.updateTag({ name: 'twitter:image', content: data.image });
    }
  }

  setCanonical(url: string) {
    // Remove existing canonical
    const existing = this.doc.querySelector('link[rel="canonical"]');
    if (existing) existing.remove();

    const link = this.doc.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    this.doc.head.appendChild(link);
  }

  setOrganizationSchema() {
    this.setJsonLd('org-schema', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Qsoft Group',
      url: 'https://qsoft-group.com',
      logo: 'https://qsoft-group.com/images/logo.png',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+254-000-000000',
        contactType: 'customer service',
        areaServed: 'KE',
        availableLanguage: 'English'
      },
      sameAs: [
        'https://www.linkedin.com/company/qsoft-group',
        'https://twitter.com/qsoftgroup'
      ]
    });
  }

  setLocalBusinessSchema() {
    this.setJsonLd('local-schema', {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Qsoft Group',
      image: 'https://qsoft-group.com/images/logo.png',
      url: 'https://qsoft-group.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Karen',
        addressLocality: 'Nairobi',
        addressCountry: 'KE'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -1.3190,
        longitude: 36.7069
      },
      openingHours: 'Mo-Fr 08:00-17:00',
      priceRange: '$$'
    });
  }

  setBreadcrumbSchema(items: { name: string; url: string }[]) {
    this.setJsonLd('breadcrumb-schema', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    });
  }

  private setJsonLd(id: string, data: object) {
    // Remove existing script with same id
    const existing = this.doc.getElementById(id);
    if (existing) existing.remove();

    const script = this.doc.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    this.doc.head.appendChild(script);
  }
}