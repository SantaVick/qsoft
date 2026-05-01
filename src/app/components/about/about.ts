import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, QueryList, ViewChildren, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface TeamMember {
  name: string;
  role: string;
  image: string | null;
  bio: string;
  initials: string;
  extraImages?: string[];
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.html',
  styleUrls: ['./about.css']
})
export class About implements OnInit, OnDestroy, AfterViewInit {

  images = [
    { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop', alt: 'Team collaboration' },
    { url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=600&fit=crop', alt: 'Coding session' },
    { url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop', alt: 'Business meeting' },
    { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=600&fit=crop', alt: 'Technology innovation' }
  ];

  team: TeamMember[] = [
    {
      name: 'Charles Njihia',
      role: 'Director',
      image: 'images/Charles.png',
      bio: `Senior level Manager with over 12 years of Information Technology (IT) and business management experience in the private sector with key emphasis on infrastructure management, billing systems, biometric systems, telecommunications, telco revenue assurance, vendor management and project management. Held key roles in IBM East Africa, Airtel Kenya, Steadman Group, International Energy Technik.`,
      initials: 'CN',
      extraImages: [
        'images/2.png',
        'images/3.png',
        'images/30.png'
      ]
    },
    {
      name: 'Andrew Muiruri',
      role: 'Director',
      image: 'images/Andrew.png',
      bio: `Broad exposure gained as a projects, operations and business development manager, in Kenya, Uganda, Rwanda, Tanzania and other Sub Sahara countries. A proven track record in delivering to scope, time and cost both infrastructure and Service implementation projects which are unique in scope and as such requiring complex multi-stake holder management.`,
      initials: 'AM',
      extraImages: [
        'images/huawei.png',
        'images/tracom.png',
        'images/26.png'
      ]
    },
    {
      name: 'Kenneth Muhia',
      role: 'Systems Architect',
      image: 'images/Kenneth.png',
      bio: `Accomplished, seasoned service delivery and application security SME with proven success in managing client relationship and operations. Operations leader with 15 years' experience managing IT Operations for Telcos with international presence in 20 countries. Technically proficient in all aspects of telecommunications, Information Technology(IT), application security & Value Added Services(VAS). Graduate of IT at Jomo Kenyatta University of Agriculture and Technology.`,
      initials: 'KM',
      extraImages: [
        'images/3.png',
        'images/ktda.png',
        'images/dov.png'
      ]
    },
    {
      name: 'Kevin Mwaura',
      role: 'Developer',
      image: 'images/Kevin.png',
      bio: `Skilled programmer, proficient in Java, PHP, Oracle SQL, Netbeans, Code igniter in php and scheduled services with Java spring framework. Has handled IT and programming for 7 companies- Corporates and Startups.`,
      initials: 'KW',
      extraImages: [
        'images/kpc.png',
        'images/t.png',
        'images/16.png'
      ]
    },
  ];

  currentIndex = 0;
  private intervalId: any;

  @ViewChildren('animateElement') animateElements!: QueryList<ElementRef>;
  private observer: IntersectionObserver | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    // Only run timer-based code in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoSlide();
    }
  }

  ngAfterViewInit() {
    // IntersectionObserver and window are browser-only APIs
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.setupIntersectionObserver(), 100);
    }
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.observer)   this.observer.disconnect();
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 3000);
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.resetInterval();
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.resetInterval();
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    this.resetInterval();
  }

  private resetInterval() {
    clearInterval(this.intervalId);
    this.startAutoSlide();
  }

  onImageError(event: Event, member: TeamMember) {
    member.image = null;
  }

  private setupIntersectionObserver() {
    const options = {
      root: null,
      threshold: 0.15,
      rootMargin: '0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          el.classList.add('in-view');
          el.classList.remove('out-view');
        } else {
          if (el.classList.contains('in-view')) {
            el.classList.add('out-view');
            el.classList.remove('in-view');
          }
        }
      });
    }, options);

    this.animateElements.forEach(el => {
      this.observer?.observe(el.nativeElement);
    });

    // Check elements already visible on load
    this.animateElements.forEach(el => {
      const rect = el.nativeElement.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
      if (isVisible) {
        el.nativeElement.classList.add('in-view');
      }
    });
  }
}