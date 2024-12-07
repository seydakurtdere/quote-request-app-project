import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; 
import { OfferComponent } from './offer/offer.component'; 
import { OfferListComponent } from './offer-list/offer-list.component'; 
import { RegisterComponent } from './register/register.component'; 

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' }, // Giriş yapmamışsa login sayfasına yönlendir
  { path: 'login', component: LoginComponent}, 
  { path: 'register', component: RegisterComponent},
  { path: 'offer', component: OfferComponent }, 
  { path: 'offer-list', component: OfferListComponent },  
];

