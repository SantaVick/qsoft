import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { SeoService } from '../seo-service/seo-service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact implements OnInit, OnDestroy {

  @ViewChild('contactForm') contactForm!: NgForm;

  submitted           = false;
  loading             = false;
  error               = false;
  errorMessage        = '';
  loadingMessage      = 'Sending your message...';
  formSubmitAttempted = false;

  private readonly API         = 'http://localhost:3000/api/v1/contact';
  private readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private sub!: Subscription;
  private t1!: ReturnType<typeof setTimeout>;
  private t2!: ReturnType<typeof setTimeout>;

  constructor(
    private http: HttpClient,
    private seoService: SeoService
  ) {}

  ngOnInit() {
    this.seoService.setPageMeta({
      title: 'Contact Us | Qsoft Group — Start a Project',
      description: 'Get in touch with Qsoft Group in Karen, Nairobi. Let\'s discuss how we can transform your organisation with enterprise technology that scales.',
      keywords: 'contact Qsoft Group, hire software company Kenya, IT company Karen Nairobi, start a project Kenya, enterprise software quote Kenya',
      image: 'https://qsoft-group.com/images/qsoft-home-og.jpg',
      url: 'https://qsoft-group.com/contact',
      type: 'website'
    });
    this.seoService.setBreadcrumbSchema([
      { name: 'Home', url: 'https://qsoft-group.com/' },
      { name: 'Contact', url: 'https://qsoft-group.com/contact' }
    ]);
  }

  get emailInvalid(): boolean {
    const email = this.contactForm?.value?.email?.trim();
    if (!email) return true;
    return !this.EMAIL_REGEX.test(email);
  }

  get messageError(): boolean {
    const msg = this.contactForm?.value?.message?.trim();
    return !msg || msg.length < 10;
  }

  get messageTooShort(): boolean {
    const msg = this.contactForm?.value?.message?.trim();
    return !!msg && msg.length > 0 && msg.length < 10;
  }

  onSubmit(): void {
    this.formSubmitAttempted = true;

    const v   = this.contactForm.value;
    const msg = v.message?.trim();

    const coreValid =
      !!v.firstName?.trim()                  &&
      !!v.lastName?.trim()                   &&
      !!v.email?.trim()                      &&
      this.EMAIL_REGEX.test(v.email?.trim()) &&
      !!v.service                            &&
      !!msg && msg.length >= 10;

    if (!coreValid) {
      setTimeout(() => {
        const firstError = document.querySelector('.input-error') as HTMLElement;
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
      }, 50);
      return;
    }

    this.loading        = true;
    this.error          = false;
    this.errorMessage   = '';
    this.loadingMessage = 'Validating your details...';

    this.t1 = setTimeout(() => {
      if (this.loading) this.loadingMessage = 'Sending your message...';
    }, 1500);

    this.t2 = setTimeout(() => {
      if (this.loading) this.loadingMessage = 'Almost there...';
    }, 3500);

    const payload: any = {
      firstName: v.firstName.trim(),
      lastName:  v.lastName.trim(),
      email:     v.email.trim(),
      service:   v.service,
      message:   msg,
    };

    if (v.phone?.trim())   payload.phone   = v.phone.trim();
    if (v.company?.trim()) payload.company = v.company.trim();

    this.sub = this.http.post(this.API, payload).subscribe({
      next: (res) => {
        this.clearTimers();
        this.submitted           = true;
        this.loading             = false;
        this.formSubmitAttempted = false;
        this.contactForm.reset();

        setTimeout(() => {
          this.submitted = false;
        }, 5000);
      },
      error: (err) => {
        this.clearTimers();
        this.loading = false;
        this.error   = true;

        const msg = JSON.stringify(err.error || '').toLowerCase();

        if (err.status === 429) {
          this.errorMessage = 'Too many attempts. Please wait a minute and try again.';
        } else if (err.status === 400 && msg.includes('email')) {
          this.errorMessage = 'Please provide a valid email address.';
        } else if (err.status === 400 && msg.includes('valid')) {
          this.errorMessage = 'This email address does not exist. Please use a real email.';
        } else if (err.status === 400) {
          this.errorMessage = 'Some fields are invalid. Please check and try again.';
        } else if (err.status === 0) {
          this.errorMessage = 'Cannot connect to the server. Please check your connection and try again.';
        } else {
          this.errorMessage = 'Something went wrong. Please try again or email us at info@qsoft-group.com';
        }
      }
    });
  }

  private clearTimers(): void {
    clearTimeout(this.t1);
    clearTimeout(this.t2);
  }

  ngOnDestroy(): void {
    this.clearTimers();
    this.sub?.unsubscribe();
  }
}