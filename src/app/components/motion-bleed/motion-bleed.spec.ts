import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotionBleed } from './motion-bleed';

describe('MotionBleed', () => {
  let component: MotionBleed;
  let fixture: ComponentFixture<MotionBleed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotionBleed],
    }).compileComponents();

    fixture = TestBed.createComponent(MotionBleed);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
