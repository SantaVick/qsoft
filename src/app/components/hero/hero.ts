import {
  Component, OnInit, OnDestroy, AfterViewInit,
  Inject, PLATFORM_ID,
  ViewChild, ElementRef, HostListener, ChangeDetectorRef
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../seo-service/seo-service';

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

interface Feature {
  title: string;
  body: string;
}

interface ProcessStep {
  image: string;
  title: string;
  body: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.css']
})
export class Hero implements OnInit, OnDestroy, AfterViewInit {

  // ── Slider ──
  currentSlide = 0;
  progressWidth = 0;
  private timer: any = null;
  private progressTimer: any = null;
  private busy = false;
  private readonly INTERVAL = 3500;
  

  // ── Modal ──
  selectedProject: Project | null = null;
  isModalOpen = false;

  // ── Scroll reveal ──
  private revealObserver: IntersectionObserver | null = null;

  // ── Process circle ──
  @ViewChild('processWrap') processWrap!: ElementRef<HTMLDivElement>;

  circleSize = 850;
  orbitR     = 285;
  cardW      = 210;
  cardH      = 195;
  isMobile   = false;

  // ── Sector toggle ──
  activeSector: 'private' | 'government' = 'private';

  // ── Data ──
  slides: Slide[] = [
    { imageUrl: 'images/try.png', label: '', caption: 'Infrastructure that scales with you' },
    { imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&q=85&auto=format&fit=crop',
      label: 'Enterprise Software', caption: 'Systems engineered for scale' },
    { imageUrl: 'images/tech.png', label: 'People & Process', caption: 'Collaborative teams, lasting outcomes' },
    { imageUrl: 'images/image2.png', label: 'Technology', caption: 'Best Tech' },
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
  activeCardIndex = 1; // default center card

setActiveCard(index: number) {
  this.activeCardIndex = index;
}

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
    { image: 'images/discover.png', title: 'Discovery', body: 'Deep-dive workshops to understand your business, users, and technical constraints.' },
    { image: 'images/architecture.png', title: 'Architecture', body: 'We design scalable, secure systems tailored precisely to your requirements.' },
    { image: 'images/build.png', title: 'Build', body: 'Agile sprints with continuous delivery and regular client checkpoints.' },
    { image: 'images/test.png', title: 'Test & Secure', body: 'Rigorous QA, load testing, and security audits before any go-live.' },
    { image: 'images/deploy.png', title: 'Deploy & Support', body: 'Smooth rollout with 24/7 monitoring and dedicated support SLAs.' }
  ];

  // ── Constructor ──
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private seoService: SeoService  // ADD THIS
  ) {}

  // ── Lifecycle ──
  ngOnInit() {
    this.startAuto();
    this.setHomePageSEO();  // ADD THIS
  }

  // ADD THIS METHOD
  private setHomePageSEO() {
    this.seoService.setPageMeta({
      title: 'Qsoft-Group — Touching lives Through intelligent technology',
      description: 'Qsoft-Group is a leading software development company based in Karen, Nairobi. We build custom enterprise, government, fintech, and IoT solutions that touch lives across East Africa. 15+ years of excellence.',
      keywords: 'software development Nairobi, custom software Kenya, IT company Karen Nairobi, enterprise software Kenya, digital transformation Africa, QSoft Group, fintech solutions Kenya, government software Kenya, IoT development Nairobi, web app development Kenya, mobile app development Kenya, software company Karen, IT services Nairobi, revenue collection systems, ERP systems Kenya',
      image: 'https://qsoft-group.com/images/qsoft-home-og.jpg',
      url: 'https://qsoft-group.com/',
      type: 'website'
    });
    this.seoService.setOrganizationSchema();
    this.seoService.setLocalBusinessSchema();
    this.seoService.setBreadcrumbSchema([
      { name: 'Home', url: 'https://qsoft-group.com/' }
    ]);
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initScrollReveal();
      this.calcCircle();
    }
  }

  ngOnDestroy() {
    this.stopAuto();
    this.revealObserver?.disconnect();
  }

  // ── Circle calculations ──
  @HostListener('window:resize')
  onResize() {
    this.calcCircle();
  }

  calcCircle() {
    if (typeof window === 'undefined') return;
    this.isMobile = window.innerWidth <= 900;

    const w = window.innerWidth;
    
    if (w <= 480) {
      this.circleSize = w - 20;
    } else if (w <= 900) {
      this.circleSize = Math.min(w - 60, 600);
    } else {
      this.circleSize = Math.min(w - 80, 850);
    }
    
    this.orbitR = this.circleSize * 0.335;
    this.cardW = Math.min(210, this.circleSize * 0.262);
    this.cardH = Math.min(195, this.circleSize * 0.30);
    this.cdr.markForCheck();
  }

  getStepPos(index: number): { [k: string]: string } {
    const total = this.processSteps.length;
    const angleDeg = -90 + (360 / total) * index;
    const rad = (angleDeg * Math.PI) / 180;
    const cx = this.circleSize / 2;
    const cy = this.circleSize / 2;
    const x = cx + this.orbitR * Math.cos(rad) - this.cardW / 2;
    const y = cy + this.orbitR * Math.sin(rad) - this.cardH / 2;
    return { position: 'absolute', top: `${y}px`, left: `${x}px`, width: `${this.cardW}px` };
  }

  arcPath(index: number): string {
    const total = this.processSteps.length;
    const inset = 18;
    const r = this.orbitR - inset;
    const cx = this.circleSize / 2;
    const cy = this.circleSize / 2;

    const fromDeg = -90 + (360 / total) * index;
    const toDeg = -90 + (360 / total) * ((index + 1) % total);

    const toRad = (d: number) => d * Math.PI / 180;
    const x1 = cx + r * Math.cos(toRad(fromDeg));
    const y1 = cy + r * Math.sin(toRad(fromDeg));
    const x2 = cx + r * Math.cos(toRad(toDeg));
    const y2 = cy + r * Math.sin(toRad(toDeg));

    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }

  // ── Scroll reveal ──
  private initScrollReveal() {
    const elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;

    const isInViewport = (el: Element): boolean => {
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight - 100 && rect.bottom > 0;
    };

    const toObserve: Element[] = [];
    elements.forEach((el: Element) => {
      const htmlEl = el as HTMLElement;
      const delay = htmlEl.getAttribute('data-delay');
      if (delay) htmlEl.style.transitionDelay = `${delay}ms`;

      if (isInViewport(el)) {
        el.classList.add('revealed');
      } else {
        toObserve.push(el);
      }
    });

    if (toObserve.length) {
      this.revealObserver = new IntersectionObserver(
        entries => {
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
      document.querySelectorAll('[data-reveal]:not(.revealed)')
               .forEach(el => el.classList.add('revealed'));
    }, 200);
  }

  // ── Slider ──
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

  // ── 3D Tilt Effect ──
  applyTilt(event: MouseEvent, cardWrapper: HTMLElement) {
    if (!cardWrapper || window.innerWidth <= 900) return;

    const card = cardWrapper.querySelector('.tilt-card') as HTMLElement;
    const glare = cardWrapper.querySelector('.card-glare') as HTMLElement;
    if (!card || !glare) return;

    const rect = cardWrapper.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    const isLeft = cardWrapper.classList.contains('left');
    const isRight = cardWrapper.classList.contains('right');
    
    let baseRotateY = 0;
    if (isLeft) baseRotateY = 5;
    if (isRight) baseRotateY = -5;

    card.style.transform = `
      perspective(1200px)
      rotateX(${25 + rotateX}deg)
      rotateY(${baseRotateY + rotateY}deg)
      translateY(-10px)
    `;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    
    glare.style.background = `
      radial-gradient(circle at ${glareX}% ${glareY}%,
        rgba(255,255,255,0.5),
        transparent 60%)
    `;
  }
  @ViewChild('tiltGrid') tiltGrid!: ElementRef;

onTiltScroll(e: Event) {
  const el = e.target as HTMLElement;
  const cardWidth = el.firstElementChild
    ? (el.firstElementChild as HTMLElement).offsetWidth + 16
    : el.scrollWidth / 3;
  this.activeCardIndex = Math.round(el.scrollLeft / cardWidth);
}

  resetTilt(cardWrapper: HTMLElement) {
    if (!cardWrapper || window.innerWidth <= 900) return;

    const card = cardWrapper.querySelector('.tilt-card') as HTMLElement;
    const glare = cardWrapper.querySelector('.card-glare') as HTMLElement;
    if (!card || !glare) return;

    const isLeft = cardWrapper.classList.contains('left');
    const isRight = cardWrapper.classList.contains('right');
    
    let defaultTransform = 'perspective(1200px) rotateX(30deg)';
    
    if (isLeft) {
      defaultTransform = 'perspective(1200px) rotateX(30deg) rotateY(5deg)';
    } else if (isRight) {
      defaultTransform = 'perspective(1200px) rotateX(30deg) rotateY(-5deg)';
    }

    card.style.transform = defaultTransform;
    
    glare.style.background = `
      radial-gradient(circle at 50% 50%,
        rgba(255,255,255,0.3),
        transparent 60%)
    `;
  }

  // ── Modal ──
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

  // ── Utilities ──
  scrollTo(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.pageYOffset - 80,
        behavior: 'smooth'
      });
    }
  }

  pad(num: number): string {
    return String(num).padStart(2, '0');
  }
}