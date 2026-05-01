import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer'; 
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
})
export class App implements OnInit, OnDestroy {

  private dot!: HTMLElement;
  private ring!: HTMLElement;
  private cur!: HTMLElement;
  private mx = 0; private my = 0;   // mouse position
  private rx = 0; private ry = 0;   // ring position (lerped)
  private raf: any = null;

  private onMouseMove = (e: MouseEvent) => {
    this.mx = e.clientX;
    this.my = e.clientY;
    // move dot instantly
    this.dot.style.left = this.mx + 'px';
    this.dot.style.top  = this.my + 'px';
  };

  private onMouseOver = (e: MouseEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest('a, button, input, textarea, select, [data-hover]')) {
      this.cur.classList.add('hov');
    }
  };

  private onMouseOut = (e: MouseEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest('a, button, input, textarea, select, [data-hover]')) {
      this.cur.classList.remove('hov');
    }
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Only enable on non-touch devices
    if (window.matchMedia('(pointer: fine)').matches) {
      document.body.classList.add('cur-on');

      this.cur  = document.getElementById('cur')!;
      this.dot  = this.cur.querySelector('.c-dot') as HTMLElement;
      this.ring = this.cur.querySelector('.c-ring') as HTMLElement;

      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseover', this.onMouseOver);
      document.addEventListener('mouseout',  this.onMouseOut);

      this.animateRing();
    }
  }

  private animateRing() {
    // Smooth ring follows mouse with lerp
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const loop = () => {
      this.rx = lerp(this.rx, this.mx, 0.13);
      this.ry = lerp(this.ry, this.my, 0.13);
      this.ring.style.left = this.rx + 'px';
      this.ring.style.top  = this.ry + 'px';
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  ngOnDestroy() {
    if (!isPlatformBrowser(this.platformId)) return;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseover', this.onMouseOver);
    document.removeEventListener('mouseout',  this.onMouseOut);
    if (this.raf) cancelAnimationFrame(this.raf);
  }
}