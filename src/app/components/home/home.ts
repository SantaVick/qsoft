import { Component } from '@angular/core';
import { Hero } from '../hero/hero';
import { MotionBleed } from '../motion-bleed/motion-bleed';
import { About } from '../about/about';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, MotionBleed, About],
  templateUrl: './home.html',
})
export class Home {}