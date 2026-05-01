import { Component, OnInit, AfterViewInit } from '@angular/core';
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
      id: 3,
      client: 'Kajiado County ADCB',
      category: 'Government · Licensing',
      title: 'Liquor Licence Cashless System',
      description: 'Cashless liquor licensing and revenue collection platform.',
      fullDescription: 'A fully integrated cashless revenue collection platform designed for the Alcoholic Drinks Control Board. The system digitizes the entire liquor licensing lifecycle, including application submission, approval workflows, and secure payment processing. It eliminates manual cash handling, reduces revenue leakages, and enhances transparency across departments. Administrators benefit from real-time dashboards, detailed reporting, and audit trails that improve compliance and decision-making.',
      year: '2019',
      image: 'images/kajiado.png',
    },
    {
      id: 4,
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
      id: 2,
      client: 'Mecoy Consulting Engineers',
      category: 'Infrastructure · Traffic',
      title: 'Traffic Engineering — Eldoret',
      description: 'Traffic flow evaluation at junctions across Eldoret town, formulating optimal timing and flow sequences to achieve urban decongestion.',
      fullDescription: 'jj',
      year: '2016',
      image: 'images/mecoy.png',
    },
    {
      id: 5,
      client: 'Nyandarua County',
      category: 'Government · Fintech',
      title: 'Multi-Channel Revenue Platform',
      description: 'County-wide revenue collection with electronic receipting via POS devices and cashless collections via mobile money and banks.',
      fullDescription: 'kfkf',
      year: '2018',
      featured: true,
      image: 'images/nyandarua-logo.png',
    },
    {
      id: 1,
      client: 'The Periodontist',
      category: 'Healthcare · Web',
      title: 'Corporate Website & Maintenance',
      description: 'Design, implementation and ongoing maintenance of the corporate web presence for a leading dental centre.',
      fullDescription: 'fnjdfs,md',
      year: '2015',
      image: 'images/periodontist.png',
    },
    {
      id: 6,
      client: 'Kenya Bureau of Standards',
      category: 'Government · Automation',
      title: 'Standards Automation Platform',
      description: 'Design and development of a turn key project automating the areas of Standards development, market surveillance, design, implementation and maintenance of the import inspections corporate website, and quality assurance processes. It entailed integrations done to other government agencies and payment platforms.',
      fullDescription: 'fkfkkfd',
      year: '2020',
      featured: true,
      image: 'images/kebs_logo.png',
    }
  ];

  selectedProject: Project | null = null;
  isModalOpen = false;

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 120);
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

  pad(num: number): string {
    return String(num).padStart(2, '0');
  }

  getDist(i: number): number {
    return i - (this.projects.length - 1) / 2;
  }
}