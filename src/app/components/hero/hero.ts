import {
  Component, OnInit, OnDestroy, AfterViewInit,
  Inject, PLATFORM_ID,
  ViewChild, ElementRef, HostListener, ChangeDetectorRef
} from '@angular/core';
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

  // ── Data ──
  slides: Slide[] = [
    { imageUrl: 'images/try.png', label: '', caption: 'Infrastructure that scales with you' },
    { imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&q=85&auto=format&fit=crop',
      label: 'Enterprise Software', caption: 'Systems engineered for scale' },
    { imageUrl: 'images/image 1.png', label: 'People & Process', caption: 'Collaborative teams, lasting outcomes' },
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
    private cdr: ChangeDetectorRef
  ) {}

  // ── Lifecycle ──
  ngOnInit() {
    this.startAuto();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initCardAnimation();
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
// 1. calcCircle — remove isMobile early return, always calculate
calcCircle() {
  if (typeof window === 'undefined') return;
  this.isMobile = window.innerWidth <= 900;

  if (this.isMobile) {
    const size      = window.innerWidth - 40;
    this.circleSize = size;
    this.orbitR     = size * 0.32;
    this.cardW      = Math.floor(size * 0.26);
    this.cardH      = Math.floor(size * 0.44);
  } else {
    const avail     = Math.min(window.innerWidth - 80, 850);
    this.circleSize = avail;
    this.orbitR     = avail * 0.335;
    this.cardW      = Math.min(210, avail * 0.262);
    this.cardH      = 195;
  }

  this.cdr.markForCheck();
}

// 2. getStepPos — always return position, never return {}
getStepPos(index: number): { [k: string]: string } {
  const total    = this.processSteps.length;
  const angleDeg = -90 + (360 / total) * index;
  const rad      = (angleDeg * Math.PI) / 180;
  const cx       = this.circleSize / 2;
  const cy       = this.circleSize / 2;
  const x        = cx + this.orbitR * Math.cos(rad) - this.cardW / 2;
  const y        = cy + this.orbitR * Math.sin(rad) - this.cardH / 2;
  return { position: 'absolute', top: `${y}px`, left: `${x}px`, width: `${this.cardW}px` };
}

  arcPath(index: number): string {
    const total    = this.processSteps.length;
    const inset    = 18;
    const r        = this.orbitR - inset;
    const cx       = this.circleSize / 2;
    const cy       = this.circleSize / 2;

    const fromDeg  = -90 + (360 / total) * index;
    const toDeg    = -90 + (360 / total) * ((index + 1) % total);

    const toRad    = (d: number) => d * Math.PI / 180;
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
      const delay  = htmlEl.getAttribute('data-delay');
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
    if (this.timer)        { clearInterval(this.timer);        this.timer = null; }
    if (this.progressTimer){ clearInterval(this.progressTimer); this.progressTimer = null; }
    this.progressWidth = 0;
  }

  private resetProgress() {
    if (this.progressTimer) clearInterval(this.progressTimer);
    this.progressWidth = 0;
    const step = 100 / (this.INTERVAL / 50);
    this.progressTimer = setInterval(() => {
      this.progressWidth = Math.min(100, this.progressWidth + step);
    }, 50);
  }private initCardAnimation() {
  const scene      = document.querySelector('.stack-scene') as HTMLElement;
  const floatCards = Array.from(document.querySelectorAll('.float-card')) as HTMLElement[];
  if (!scene || !floatCards.length) return;

  let triggered = false;
  let timeouts: any[] = [];

  const applySettledStyle = (card: HTMLElement, isGov: boolean) => {
    card.style.backdropFilter         = 'blur(22px) saturate(160%)';
    (card.style as any)['-webkit-backdrop-filter'] = 'blur(22px) saturate(160%)';
    card.style.background             = 'rgba(255,255,255,0.18)';
    card.style.border                 = '1px solid rgba(255,255,255,0.35)';
    card.style.borderTop              = isGov ? '2px solid rgba(220,38,38,0.6)' : '2px solid rgba(29,78,216,0.6)';
    card.style.boxShadow              = '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)';

    card.querySelectorAll<HTMLElement>('h3').forEach(el => {
      el.style.fontSize = '1.05rem'; el.style.fontWeight = '800';
      el.style.color = '#111'; el.style.letterSpacing = '-0.02em';
    });
    card.querySelectorAll<HTMLElement>('.tagline').forEach(el => {
      el.style.fontSize = '0.82rem'; el.style.color = '#555'; el.style.lineHeight = '1.6';
    });
    card.querySelectorAll<HTMLElement>('.fc-list li').forEach(el => {
      el.style.fontSize = '0.8rem'; el.style.color = '#374151';
      el.style.borderBottom = '0.5px solid rgba(0,0,0,0.06)'; el.style.padding = '4px 0';
    });
    card.querySelectorAll<HTMLElement>('.fc-dot').forEach(el => {
      el.style.background = isGov ? '#dc2626' : '#1d4ed8';
      el.style.width = '6px'; el.style.height = '6px'; el.style.minWidth = '6px';
    });
    card.querySelectorAll<HTMLElement>('.fc-badge').forEach(el => {
      el.style.background   = isGov ? 'rgba(220,38,38,0.12)' : 'rgba(29,78,216,0.12)';
      el.style.color        = isGov ? '#dc2626' : '#1d4ed8';
      el.style.fontSize     = '0.68rem'; el.style.fontWeight = '800';
      el.style.padding      = '0.3rem 0.85rem'; el.style.borderRadius = '999px';
      el.style.border       = isGov ? '0.5px solid rgba(220,38,38,0.25)' : '0.5px solid rgba(29,78,216,0.25)';
    });
    card.querySelectorAll<HTMLElement>('.fc-tag').forEach(el => {
      el.style.background   = 'rgba(0,0,0,0.05)'; el.style.color = '#555';
      el.style.fontSize     = '0.68rem'; el.style.fontWeight = '600';
      el.style.border       = '0.5px solid rgba(0,0,0,0.08)';
      el.style.padding      = '0.25rem 0.7rem'; el.style.borderRadius = '999px';
    });
    card.querySelectorAll<HTMLElement>('.fc-tags').forEach(el => {
      el.style.borderTop = '0.5px solid rgba(0,0,0,0.06)'; el.style.paddingTop = '0.6rem';
    });
    card.querySelectorAll<HTMLElement>('.fc-icon').forEach(el => {
      el.style.background = 'rgba(255,255,255,0.5)';
      el.style.border     = '0.5px solid rgba(255,255,255,0.8)';
    });
  };

  const createSectorLabel = (id: string, text: string, icon: string, x: number, y: number) => {
    if (document.getElementById(id)) return;
    const el = document.createElement('div');
    el.id = id;
    el.innerHTML = `<span>${icon}</span>${text}`;
    el.style.cssText = `
      position: absolute; left: ${x}px; top: ${y}px;
      font-family: 'Syne', sans-serif; font-size: 1rem;
      font-weight: 800; color: #111;
      display: flex; align-items: center; gap: 8px;
      opacity: 0; transform: translateY(8px);
      transition: opacity 0.5s ease, transform 0.5s ease;
      z-index: 20; white-space: nowrap;
    `;
    scene.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }));
  };

  const shiftRemainingDown = (fromIndex: number) => {
    const stackTops = [0, 110, 220, 330, 440];
    for (let j = fromIndex; j < floatCards.length; j++) {
      const card = floatCards[j];
      if (card.dataset['settled'] === 'true') continue;
      card.style.transition = 'top 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
      card.style.top        = `${stackTops[j] + fromIndex * 80}px`;
    }
  };

  const settle = () => {
  if (triggered) return;
  triggered = true;

  const sceneW  = scene.offsetWidth;
  const isMobileView = window.innerWidth <= 900;
  const gap     = 16;
  const padX    = isMobileView ? 16 : 40;

  if (isMobileView) {
    // ── MOBILE / TABLET: vertical stack, full width cards ──
    const cardW = sceneW - padX * 2;
    const cardH = 320; // estimated card height
    const startY = 44; // space for no sector labels on mobile

    const positions = [
      { x: padX, y: startY,                        w: cardW, isGov: true  },
      { x: padX, y: startY + cardH + gap,           w: cardW, isGov: true  },
      { x: padX, y: startY + (cardH + gap) * 2,     w: cardW, isGov: false },
      { x: padX, y: startY + (cardH + gap) * 3,     w: cardW, isGov: false },
      { x: padX, y: startY + (cardH + gap) * 4,     w: cardW, isGov: false },
    ];

    // set scene tall enough for all 5 cards
    scene.style.transition = 'height 1.2s cubic-bezier(0.22,1,0.36,1)';
    scene.style.height     = `${startY + (cardH + gap) * 5 + 40}px`;

    floatCards.forEach((card, i) => {
      const pos = positions[i];
      timeouts.push(setTimeout(() => {

        card.style.animation  = 'none';
        card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.4, 0.64, 1)';
        card.style.transform  = 'rotateX(48deg) rotateZ(-20deg) translateY(-50px) scale(1.05)';

        timeouts.push(setTimeout(() => {
          card.style.transition = `
            top           1.8s cubic-bezier(0.22, 1, 0.36, 1),
            left          1.8s cubic-bezier(0.22, 1, 0.36, 1),
            width         1.8s cubic-bezier(0.22, 1, 0.36, 1),
            transform     1.8s cubic-bezier(0.22, 1, 0.36, 1),
            border-radius 1.6s ease,
            box-shadow    1.6s ease
          `;
          card.style.top          = `${pos.y}px`;
          card.style.left         = `${pos.x}px`;
          card.style.marginLeft   = '0';
          card.style.width        = `${pos.w}px`;
          card.style.transform    = 'rotateX(0deg) rotateZ(0deg) translateY(0) scale(1)';
          card.style.borderRadius = '20px';
          card.style.zIndex       = '2';
          card.style.padding      = '1.25rem';
          card.dataset['settled'] = 'true';

          timeouts.push(setTimeout(() => {
            applySettledStyle(card, pos.isGov);
          }, 1900));
        }, 550));
      }, i * 600)); // slightly faster stagger on mobile
    });

  } else {
    // ── DESKTOP: original 2-row grid layout ──
    const govCardW  = Math.floor((sceneW - padX * 2 - gap) / 2);
    const privCardW = Math.floor((sceneW - padX * 2 - gap * 2) / 3);
    const govY      = 60;
    const privY     = 420;

    const positions = [
      { x: padX,                         y: govY,  w: govCardW,  isGov: true  },
      { x: padX + govCardW + gap,         y: govY,  w: govCardW,  isGov: true  },
      { x: padX,                         y: privY, w: privCardW, isGov: false },
      { x: padX + privCardW + gap,        y: privY, w: privCardW, isGov: false },
      { x: padX + (privCardW + gap) * 2,  y: privY, w: privCardW, isGov: false },
    ];

    scene.style.transition = 'height 1.2s cubic-bezier(0.22,1,0.36,1)';
    scene.style.height     = '820px';

    floatCards.forEach((card, i) => {
      const pos = positions[i];
      timeouts.push(setTimeout(() => {
        shiftRemainingDown(i + 1);

        if (i === 0) createSectorLabel('label-gov', 'Government & Public Sector', '🏛️', padX, govY - 44);
        if (i === 2) createSectorLabel('label-priv', 'Private Sector', '🏢', padX, privY - 44);

        card.style.animation  = 'none';
        card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.4, 0.64, 1)';
        card.style.transform  = 'rotateX(48deg) rotateZ(-20deg) translateY(-50px) scale(1.05)';

        timeouts.push(setTimeout(() => {
          card.style.transition = `
            top           1.8s cubic-bezier(0.22, 1, 0.36, 1),
            left          1.8s cubic-bezier(0.22, 1, 0.36, 1),
            width         1.8s cubic-bezier(0.22, 1, 0.36, 1),
            transform     1.8s cubic-bezier(0.22, 1, 0.36, 1),
            border-radius 1.6s ease,
            box-shadow    1.6s ease
          `;
          card.style.top          = `${pos.y}px`;
          card.style.left         = `${pos.x}px`;
          card.style.marginLeft   = '0';
          card.style.width        = `${pos.w}px`;
          card.style.transform    = 'rotateX(0deg) rotateZ(0deg) translateY(0) scale(1)';
          card.style.borderRadius = '24px';
          card.style.zIndex       = '2';
          card.style.padding      = '1.5rem';
          card.dataset['settled'] = 'true';

          timeouts.push(setTimeout(() => {
            applySettledStyle(card, pos.isGov);
          }, 1900));
        }, 550));
      }, i * 750));
    });
  }
};

 const reset = () => {
  triggered = false;
  timeouts.forEach(t => clearTimeout(t));
  timeouts = [];

  scene.style.transition = 'height 0.6s ease';
  scene.style.height     = '860px';

  ['label-gov', 'label-priv'].forEach(id => document.getElementById(id)?.remove());

  floatCards.forEach(card => {
    delete card.dataset['settled'];
    card.style.cssText = '';
  });
};

  // Single observer on the scene itself
  // threshold[0] = 0   → fires when scene fully leaves viewport → reset
  // threshold[1] = 0.15 → fires when 15% of scene enters viewport → settle
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        settle();
      } else {
        reset();
      }
    });
  }, {
    threshold: [0, 0.15]
  });

  observer.observe(scene);
}
  // ── Modal ──
  openModal(project: Project) {
    this.selectedProject = project;
    this.isModalOpen     = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen     = false;
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