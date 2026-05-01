import { Routes } from '@angular/router';
import { Hero } from './components/hero/hero';
import { Services } from './components/services/services';
import { About } from './components/about/about';
import { Contact } from './components/contact/contact';
import { Portfolio } from './components/portfolio/portfolio';


export const routes: Routes = [
  { path: '',                    component: Hero },
  { path: 'services',            component: Services },
  { path: 'portfolio',            component: Portfolio },
  { path: 'about',               component: About },
  { path: 'contact',             component: Contact },
  { path: '**',                  redirectTo: '' }
];