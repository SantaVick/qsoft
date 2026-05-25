import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  
  projects: Project[] = [
    {
      id: 1,
      client: 'Kajiado County ADCB',
      category: 'Government · Licensing',
      title: 'Liquor Licence Cashless System',
      description: 'Cashless liquor licensing and revenue collection platform.',
      fullDescription: 'A fully integrated cashless revenue collection platform designed for the Alcoholic Drinks Control Board. The system digitizes the entire liquor licensing lifecycle, including application submission, approval workflows, and secure payment processing. It eliminates manual cash handling, reduces revenue leakages, and enhances transparency across departments. Administrators benefit from real-time dashboards, detailed reporting, and audit trails that improve compliance and decision-making.',
      year: '2019',
      image: 'images/kajiado.png',
    },
    {
      id: 2,
      client: 'Kakamega County',
      category: 'Government · Revenue',
      title: 'USSD Revenue Collection System',
      description: 'County-wide USSD based revenue collection system integrated to the public sector revenue management backend for county revenue accounting.',
      fullDescription: 'A scalable USSD-based revenue collection platform that enables citizens to make payments using any mobile phone without requiring internet access. The system integrates directly with the county\'s backend financial systems to provide real-time transaction processing, automated reconciliation, and accurate reporting. It significantly improved accessibility for rural users, minimized delays in revenue collection, and enhanced financial accountability.',
      year: '2017',
      featured: true,
      image: 'images/kakamega-logo.png',
    },
    {
      id: 3,
      client: 'Kenya Bureau of Standards',
      category: 'Government · Automation',
      title: 'Standards Automation Platform',
      description: 'Design and development of a turn key project automating the areas of Standards development, market surveillance, design, implementation and maintenance of the import inspections corporate website, and quality assurance processes.',
      fullDescription: 'A comprehensive turn-key automation project for the Kenya Bureau of Standards (KEBS). The platform automates standards development, market surveillance, import inspections, and quality assurance processes. It includes integrations with other government agencies and payment platforms, streamlining operations and enhancing regulatory compliance across the board.',
      year: '2020',
      featured: true,
      image: 'images/kebs_logo.png',
    },
    {
      id: 4,
      client: 'Nyandarua County',
      category: 'Government · Fintech',
      title: 'Multi-Channel Revenue Platform',
      description: 'County-wide revenue collection with electronic receipting via POS devices and cashless collections via mobile money and banks.',
      fullDescription: 'A comprehensive county-wide revenue collection platform that supports multiple payment channels including POS devices, mobile money, and direct bank transfers. The system provides electronic receipting, real-time reporting, and automated reconciliation, significantly improving revenue transparency and collection efficiency for Nyandarua County.',
      year: '2018',
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
      year: '2016',
      image: 'images/mecoy.png',
    },
  ];

  selectedProject: Project | null = null;
  isModalOpen = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    // Prevent horizontal scroll globally
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflowX = 'hidden';
      document.documentElement.style.overflowX = 'hidden';
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 120);
  }

  openModal(project: Project) {
    this.selectedProject = project;
    this.isModalOpen = true;
    
    // Lock body scroll completely
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
    
    // Restore body scroll
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