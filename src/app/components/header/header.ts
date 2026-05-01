import { Component, HostListener, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnDestroy {
  scrolled = false;
  mobileMenuOpen = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.scrolled = window.scrollY > 20;
    }
  }

  @HostListener('document:keydown.escape', [])
  onEscape() {
    if (this.mobileMenuOpen) this.closeMenu();
  }

  openMenu() {
    if (isPlatformBrowser(this.platformId)) {
      this.mobileMenuOpen = true;
      document.body.classList.add('menu-open');
    }
  }

  closeMenu() {
    if (isPlatformBrowser(this.platformId)) {
      this.mobileMenuOpen = false;
      document.body.classList.remove('menu-open');
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('menu-open');
    }
  }
}