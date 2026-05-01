import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface ServiceItem {
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  subServices: string[];
  route: string;
  expanded?: boolean;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services.html',
  styleUrls: ['./services.css']
})
export class Services {
  private isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  services: ServiceItem[] = [
    { category: 'Web', title: 'Web Development', description: 'Fast, scalable web apps — from marketing sites and e-commerce to SaaS dashboards and enterprise portals.', imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80&auto=format&fit=crop', subServices: ['Frontend Engineering (React / Angular)', 'Backend APIs & Databases', 'E-Commerce Stores', 'CMS & Content Platforms', 'Progressive Web Apps (PWA)', 'Web UI/UX Design'], route: '/services/web', expanded: false },
    { category: 'Mobile', title: 'Mobile App Development', description: 'Native and cross-platform apps for iOS and Android — fast, intuitive, and offline-ready for East Africa.', imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80&auto=format&fit=crop', subServices: ['iOS Development (Swift)', 'Android Development (Kotlin / java)', 'React Native (Cross-platform)', 'Flutter Apps', 'M-Pesa & Payment Integration', 'App Store & Play Store Deployment'], route: '/services/mobile', expanded: false },
    { category: 'Enterprise', title: 'ERP & CRM Systems', description: 'Custom business systems built around how your teams actually work — not generic software forced to fit.', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&auto=format&fit=crop', subServices: ['Custom ERP Platforms', 'CRM & Sales Automation', 'HRMS & Payroll (KRA-compliant)', 'School / SACCO / Healthcare MIS', 'Inventory & Supply Chain', 'Workflow Automation'], route: '/services/erp', expanded: false },
    { category: 'Infrastructure', title: 'Network & Infrastructure', description: 'Resilient digital backbones — cloud, hybrid, LAN/WAN — built to scale without drama.', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80&auto=format&fit=crop', subServices: ['LAN / WAN & Structured Cabling', 'VPN & SD-WAN', 'Server Deployment & Management', 'NOC & 24/7 Monitoring', 'Backup & Disaster Recovery'], route: '/services/network', expanded: false },
    { category: 'Cloud', title: 'Cloud & DevOps', description: 'Move to the cloud safely, run it efficiently. We handle architecture, migration, and ongoing operations.', imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80&auto=format&fit=crop', subServices: ['AWS / Azure / GCP Architecture', 'Cloud Migration', 'DevOps & CI/CD Pipelines', 'Kubernetes & Containerisation', 'Managed Hosting'], route: '/services/cloud', expanded: false },
    { category: 'Government', title: 'Government & NGO Solutions', description: 'Secure, citizen-centred digital platforms for public institutions — transparent, auditable, built to serve at scale.', imageUrl: 'https://images.unsplash.com/photo-1568992688065-536aad8a12f6?w=800&q=80&auto=format&fit=crop', subServices: ['e-Government Citizen Portals', 'Revenue & Permit Systems', 'Land & Digital Registries', 'Procurement Management', 'M&E Platforms for NGOs'], route: '/services/government', expanded: false }
  ];

  goToService(service: ServiceItem) {
    this.router.navigate([service.route]);
  }

  toggleExpand(service: ServiceItem, event: Event) {
    event.stopPropagation();
    service.expanded = !service.expanded;
  }

  isTouchDevice(): boolean {
    if (!this.isBrowser) return false;
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  }
}