import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-motion-bleed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './motion-bleed.html',
  styleUrls: ['./motion-bleed.css']
})
export class MotionBleed {
  scrollToAbout() {
    const element = document.getElementById('about');
    if (element) {
      const offset = 78;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  }
}