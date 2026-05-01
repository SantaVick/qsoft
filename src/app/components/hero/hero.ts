import { Component, OnInit, OnDestroy, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Slide {
  imageUrl: string;
  label: string;
  caption: string;
}

export interface Project {
  id: number;
  client: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  year: string;
  featured?: boolean;
  image: string;
}

interface Industry {
  id: string;
  icon: string;
  title: string;
  summary: string;
  detail: string;
  highlights: string[];
  tags: string[];
}

interface Service {
  icon: string;
  title: string;
  description: string;
  tags: string[];
}

interface Feature {
  title: string;
  body: string;
}

interface ProcessStep {
  icon: string;
  title: string;
  body: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

interface Certification {
  icon: string;
  label: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.css']
})
export class Hero implements OnInit, OnDestroy, AfterViewInit {

  currentSlide = 0;
  progressWidth = 0;
  private timer: any = null;
  private progressTimer: any = null;
  private busy = false;
  private readonly INTERVAL = 3500;

  activeIndustry: string | null = null;

  selectedProject: Project | null = null;
  isModalOpen = false;

  private revealObserver: IntersectionObserver | null = null;
  private portfolioObserver: IntersectionObserver | null = null;
  private hasRevealed = false;



  slides: Slide[] = [
    { imageUrl: 'images/try.png', label: '', caption: 'Infrastructure that scales with you' },
    { imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&q=85&auto=format&fit=crop', label: 'Enterprise Software', caption: 'Systems engineered for scale' },
    { imageUrl: 'images/image 1.png', label: 'People & Process', caption: 'Collaborative teams, lasting outco' },
    { imageUrl: 'images/image2.png', label: 'Technology', caption: 'Best Tech'},
    { imageUrl: 'images/image3.png', label: 'Collab', caption: 'Digital government that works' }
  ];

  marqueeItems = [
    'Revenue Collection', 'USSD Platforms', 'Traffic Engineering',
    'Standards Automation', 'Web Development', 'Mobile Apps',
    'Fintech', 'Industrial Automation', 'Security Solutions', 'Analytics',
    'Revenue Collection', 'USSD Platforms', 'Traffic Engineering',
    'Standards Automation', 'Web Development', 'Mobile Apps',
    'Fintech', 'Industrial Automation', 'Security Solutions', 'Analytics'
  ];

  industries: Industry[] = [
    {
      id: 'government',
      icon: '🏛️',
      title: 'Government & Public Sector',
      summary: 'Digital transformation for ministries, agencies, and public institutions across East Africa.',
      detail: 'We partner with government bodies to design and deploy reliable, citizen-facing digital platforms — from national revenue collection systems to standards compliance portals. Our solutions are built with regulatory frameworks, data sovereignty, and public accountability at the core.',
      highlights: [
        'Kenya Revenue Authority — automated tax filing & compliance systems',
        'Kenya Bureau of Standards — standards automation & certification portal',
        'Traffic management & enforcement platforms for county governments',
        'Secure inter-agency data exchange frameworks',
        'e-Government portals serving millions of citizens annually'
      ],
      tags: ['e-Government', 'Revenue Systems', 'Compliance', 'Open Data']
    },
    {
      id: 'finance',
      icon: '🏦',
      title: 'Financial Services',
      summary: 'Secure, compliant banking and fintech platforms processing millions of transactions daily.',
      detail: 'We build the financial infrastructure that powers banks, SACCOs, microfinance institutions, and fintech startups across East Africa. Every system is designed with fraud prevention, regulatory compliance, and resilient uptime as non-negotiable requirements.',
      highlights: [
        'Core banking integrations and real-time transaction processing',
        'USSD and mobile banking platforms for unbanked populations',
        'KYC/AML compliance automation and fraud detection engines',
        'Digital lending platforms with automated credit scoring',
        'Payment gateway aggregation and settlement systems'
      ],
      tags: ['Core Banking', 'Fintech', 'USSD', 'Compliance', 'Fraud Detection']
    },
    {
      id: 'healthcare',
      icon: '🏥',
      title: 'Healthcare',
      summary: 'Electronic health records, telemedicine, and hospital management systems.',
      detail: 'Healthcare institutions across East Africa trust us to build secure, interoperable digital health systems. Our platforms improve patient outcomes, reduce administrative overhead, and enable data-driven decision-making for clinicians and health administrators.',
      highlights: [
        'Electronic Medical Record (EMR) systems for public and private hospitals',
        'Telemedicine platforms connecting rural patients with urban specialists',
        'Laboratory information systems and diagnostic reporting',
        'Medical supply chain and pharmacy management',
        'Health analytics dashboards for ministry-level reporting'
      ],
      tags: ['EMR/EHR', 'Telemedicine', 'LIMS', 'Health Analytics']
    },
    {
      id: 'telecom',
      icon: '📡',
      title: 'Telecommunications',
      summary: 'Network infrastructure, OSS/BSS systems, and customer experience platforms.',
      detail: 'From network planning tools to customer-facing self-service portals, we help telecoms and ISPs in East Africa modernize their operations, reduce churn, and deliver consistent quality of service at scale.',
      highlights: [
        'OSS/BSS platform integration and migration',
        'Real-time network monitoring and fault management',
        'Customer self-service and CRM portals',
        'Billing, provisioning, and revenue assurance systems',
        'USSD application development and hosting'
      ],
      tags: ['OSS/BSS', 'Network Ops', 'CRM', 'Billing', 'USSD']
    }
  ];

  services: Service[] = [
    {
      icon: '💻',
      title: 'Enterprise Software Development',
      description: 'Custom ERP, CRM, and process automation systems built for the complexity and scale of East African enterprises.',
      tags: ['ERP', 'CRM', 'Workflow Automation']
    },
    {
      icon: '📱',
      title: 'Mobile & USSD Platforms',
      description: 'iOS, Android and USSD mobile applications that reach customers whether they have a smartphone or a feature phone.',
      tags: ['iOS', 'Android', 'USSD', 'PWA']
    },
    {
      icon: '🏛️',
      title: 'Government Digital Solutions',
      description: 'Revenue collection, licensing, e-government and citizen-service portals designed for massive public scale.',
      tags: ['e-Government', 'Revenue', 'Licensing']
    },
    {
      icon: '🔒',
      title: 'Cybersecurity & Compliance',
      description: 'Penetration testing, zero-trust architecture, security audits, and regulatory compliance frameworks.',
      tags: ['Pen Testing', 'Zero Trust', 'ISO 27001']
    },
    {
      icon: '☁️',
      title: 'Cloud & Infrastructure',
      description: 'Cloud-native architecture, DevOps pipelines, network design, and 24/7 managed infrastructure services.',
      tags: ['AWS', 'Azure', 'DevOps', 'Managed Services']
    },
    {
      icon: '📊',
      title: 'Data & Analytics',
      description: 'Business intelligence, data warehousing, dashboards, and AI-powered analytics for enterprise decision-making.',
      tags: ['BI', 'Data Warehouse', 'AI/ML']
    }
  ];

  features: Feature[] = [
    {
      title: 'End-to-End Ownership',
      body: 'From architecture to deployment and ongoing optimization — we take full responsibility for outcomes, not just deliverables.'
    },
    {
      title: 'Enterprise Security First',
      body: 'Bank-grade encryption, compliance frameworks, and zero-trust architecture built in from day one — never bolted on.'
    },
    {
      title: 'Scale Without Limits',
      body: 'Cloud-native infrastructure designed to handle millions of concurrent users and exponential business growth.'
    },
    {
      title: 'Local Presence, Global Standards',
      body: 'On-ground teams across East Africa with international certifications, ISO standards, and global engineering best practices.'
    }
  ];

  processSteps: ProcessStep[] = [
    { icon: '🔍', title: 'Discovery', body: 'Deep-dive workshops to understand your business, users, and technical constraints.' },
    { icon: '📐', title: 'Architecture', body: 'We design scalable, secure systems tailored precisely to your requirements.' },
    { icon: '⚙️', title: 'Build', body: 'Agile sprints with continuous delivery and regular client checkpoints.' },
    { icon: '🧪', title: 'Test & Secure', body: 'Rigorous QA, load testing, and security audits before any go-live.' },
    { icon: '🚀', title: 'Deploy & Support', body: 'Smooth rollout with 24/7 monitoring and dedicated support SLAs.' }
  ];

  

  certifications: Certification[] = [
    { icon: '🏅', label: 'ISO 27001' },
    { icon: '☁️', label: 'AWS Partner' },
    { icon: '🔐', label: 'SOC 2 Compliant' },
    { icon: '✅', label: 'ISACA Member' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.startAuto();
  }

  ngOnDestroy() {
    this.stopAuto();
    this.revealObserver?.disconnect();
    this.portfolioObserver?.disconnect();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initScrollReveal();
      // Optional: you had a portfolio reveal method, call it if needed
      // this.initPortfolioReveal();
    }
  }

  /* ---- SCROLL REVEAL (FIXED) ---- */

  private initScrollReveal() {
    const elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;

    // Helper to check if an element is in the viewport
    const isElementInViewport = (el: Element): boolean => {
      const rect = el.getBoundingClientRect();
      // Consider an element visible if it's within 100px of entering the viewport
      return rect.top < window.innerHeight - 100 && rect.bottom > 0;
    };

    // Apply delay attributes and immediately reveal elements already in view
    const toObserve: Element[] = [];
    elements.forEach((el: Element) => {
      const htmlEl = el as HTMLElement;
      const delay = htmlEl.getAttribute('data-delay');
      if (delay) {
        htmlEl.style.transitionDelay = `${delay}ms`;
      }

      if (isElementInViewport(el)) {
        // Reveal immediately
        el.classList.add('revealed');
      } else {
        toObserve.push(el);
      }
    });

    // Set up Intersection Observer for elements not yet visible
    if (toObserve.length) {
      this.revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              this.revealObserver?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
      );
      toObserve.forEach(el => this.revealObserver!.observe(el));
    }

    setTimeout(() => {
      document.querySelectorAll('[data-reveal]:not(.revealed)').forEach(el => {
        el.classList.add('revealed');
      });
    }, 200);
  }

  toggleIndustry(id: string) {
    this.activeIndustry = this.activeIndustry === id ? null : id;
  }

  goTo(index: number) {
    if (this.busy || index === this.currentSlide) return;
    if (index < 0) index = this.slides.length - 1;
    if (index >= this.slides.length) index = 0;
    this.busy = true;
    this.currentSlide = index;
    setTimeout(() => { this.busy = false; }, 520);
    this.resetProgress();
  }

  prev() {
    this.stopAuto();
    this.goTo(this.currentSlide - 1);
    setTimeout(() => this.startAuto(), 400);
  }

  next() {
    this.stopAuto();
    this.goTo(this.currentSlide + 1);
    setTimeout(() => this.startAuto(), 400);
  }

  startAuto() {
    this.stopAuto();
    this.timer = setInterval(() => {
      if (!this.busy) this.goTo(this.currentSlide + 1);
    }, this.INTERVAL);
    this.resetProgress();
  }

  stopAuto() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    if (this.progressTimer) { clearInterval(this.progressTimer); this.progressTimer = null; }
    this.progressWidth = 0;
  }

  private resetProgress() {
    if (this.progressTimer) clearInterval(this.progressTimer);
    this.progressWidth = 0;
    const step = 100 / (this.INTERVAL / 50);
    this.progressTimer = setInterval(() => {
      this.progressWidth = Math.min(100, this.progressWidth + step);
    }, 50);
  }


  openModal(project: Project) {
    this.selectedProject = project;
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedProject = null;
    document.body.style.overflow = '';
  }

  scrollTo(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = 80;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });
    }
  }

  pad(num: number): string {
    return String(num).padStart(2, '0');
  }
}