import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../seo-service/seo-service';

export interface Project {
  id: number;
  client: string;
  category: string;
  title: string;
  description: string;
  fullDescription: string;
  year: string;
  featured?: boolean;
  image: string;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './portfolio.html',
  styleUrls: ['./portfolio.css']
})
export class Portfolio implements OnInit, AfterViewInit {
  isLoaded = false;
  spreadMultiplier = 120;

  projects: Project[] = [
    {
      id: 1,
      client: 'Kajiado County ADCB',
      category: 'Government · Licensing',
      title: 'Liquor Licence Cashless System',
      description: 'Developed and implemented a cashless liquor licensing and revenue collection platform (County Pay) that streamlined licensing, compliance monitoring, and revenue collection. The system served 50+ users and 20,000+ business users, facilitating the collection of over USD 20,000 in revenue within 6 months.',
      fullDescription: 'Developed and implemented a cashless liquor licensing and revenue collection platform that streamlined licensing, compliance monitoring, and revenue collection. The system served 50+ users and 20,000+ business users, facilitating the collection of over USD 20,000 in revenue within 6 months.',
      year: '2020-2021',
      image: 'images/kajiado.png',
    },
    {
      id: 2,
      client: 'Kakamega County',
      category: 'Government · Revenue',
      title: 'Revenue Collection System (County Pay)',
      description: 'Developed and deployed  revenue collection platform (County Pay) system integrated with the public sector revenue management backend for county revenue accounting. The platform supports 225 configured revenue streams, serves 300+ users, handles 60+ transactions per second, and has facilitated the collection of over USD 2.5 million in revenue over 4 years.',
      fullDescription: 'Developed and deployed a county-wide USSD-based revenue collection system integrated with the public sector revenue management backend for county revenue accounting. The platform supports 225 configured revenue streams, serves 300+ users, handles 60+ transactions per second, and has facilitated the collection of over USD 2.5 million in revenue over 4 years.',
      year: '2019-2022',
      featured: true,
      image: 'images/kakamega-logo.png',
    },
    {
      id: 3,
      client: 'Kenya Bureau of Standards',
      category: 'Government · Automation',
      title: 'Standards Automation Platform',
      description: 'Design and develop a comprehensive Enterprise Resource Planning (ERP) solution for a Standards Bureau, automating standards development, market surveillance, import inspection, and quality assurance processes, while also designing, implementing, and maintaining the corporate website. The platform serves over 500 system users and more than 100,000 business users, processes up to 1,000 transactions per second (TPS), and facilitates the collection of over USD 92 million in revenue within a three-year period.',
      fullDescription: 'Design and develop a comprehensive Enterprise Resource Planning (ERP) solution for a Standards Bureau, automating standards development,market surveillance, import inspection, and quality assurance processes, while also designing, implementing, and maintaining the corporate website. The platform serves over 500 system users and more than 100,000 business users, processes up to 1,000 transactions per second (TPS), and facilitates the collection of over USD 92 million in revenue within a three-year period.',
      year: 'Ongoing',
      featured: true,
      image: 'images/kebs_logo.png',
    },
    {
      id: 4,
      client: 'Nyandarua County',
      category: 'Government · Fintech',
      title: 'Multi-Channel Revenue Platform',
      description: 'Implemented a county-wide revenue collection system serves 200+ users for 5 years, enabling electronic receipting through POS devices and cashless collections via mobile money and banking channels, with revenue collections exceeding USD 2.5 million.',
      fullDescription: 'Implemented a county-wide revenue collection system serving 200+ users for 5 years, enabling electronic receipting through POS devices and cashless collections via mobile money and banking channels, with revenue collections exceeding USD 2.5 million.',
      year: '2019-2025',
      featured: true,
      image: 'images/nyandarua-logo.png',
    },
    {
      id: 5,
      client: 'The Periodontist',
      category: 'Healthcare · Web',
      title: 'Corporate Website & Maintenance',
      description: 'Design, implementation and ongoing maintenance of the corporate web presence for a leading dental centre.',
      fullDescription: 'Complete design, development, and ongoing maintenance of a professional corporate website for a leading dental practice. The site features appointment booking, patient information portals, service showcases, and responsive design for all devices. Ongoing maintenance ensures security updates, content freshness, and optimal performance.',
      year: '2015',
      image: 'images/periodontist.png',
    },
    {
      id: 6,
      client: 'Mecoy Consulting Engineers',
      category: 'Infrastructure · Traffic',
      title: 'Traffic Engineering — Eldoret',
      description: 'Traffic flow evaluation at junctions across Eldoret town, formulating optimal timing and flow sequences to achieve urban decongestion.',
      fullDescription: 'Comprehensive traffic engineering study conducted across major junctions in Eldoret town. The project involved detailed traffic flow analysis, peak hour evaluation, and formulation of optimal signal timing sequences. The resulting implementation achieved significant urban decongestion and improved traffic flow efficiency throughout the town.',
      year: '2014',
      image: 'images/mecoy.png',
    },
  ];

  selectedProject: Project | null = null;
  isModalOpen = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private seoService: SeoService
  ) {
    this.updateSpreadMultiplier();
  }

  ngOnInit() {
    this.seoService.setPageMeta({
      title: 'Our Work | Qsoft Group — Projects That Made an Impact',
      description: 'Explore Qsoft Group\'s portfolio. From Kajiado County revenue systems to KEBS standards automation — real systems, real scale, real outcomes across Kenya and East Africa.',
      keywords: 'Qsoft portfolio, government software Kenya, Kajiado County system, KEBS automation, Kakamega revenue collection, Nyandarua county, traffic engineering Kenya, software projects Kenya',
      image: 'https://qsoft-group.com/images/qsoft-home-og.jpg',
      url: 'https://qsoft-group.com/portfolio',
      type: 'website'
    });
    this.seoService.setBreadcrumbSchema([
      { name: 'Home', url: 'https://qsoft-group.com/' },
      { name: 'Portfolio', url: 'https://qsoft-group.com/portfolio' }
    ]);

    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflowX = 'hidden';
      document.documentElement.style.overflowX = 'hidden';
      this.updateSpreadMultiplier();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 120);
  }

  @HostListener('window:resize')
  onResize() {
    this.updateSpreadMultiplier();
  }

  updateSpreadMultiplier() {
    if (typeof window === 'undefined') return;
    const w = window.innerWidth;
    if (w <= 360) {
      this.spreadMultiplier = 48;
    } else if (w <= 480) {
      this.spreadMultiplier = 55;
    } else if (w <= 700) {
      this.spreadMultiplier = 70;
    } else if (w <= 900) {
      this.spreadMultiplier = 85;
    } else {
      this.spreadMultiplier = 120;
    }
  }

  openModal(project: Project) {
    this.selectedProject = project;
    this.isModalOpen = true;

    if (isPlatformBrowser(this.platformId)) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedProject = null;

    if (isPlatformBrowser(this.platformId)) {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }

  pad(num: number): string {
    return String(num).padStart(2, '0');
  }

  getDist(i: number): number {
    return i - (this.projects.length - 1) / 2;
  }
}