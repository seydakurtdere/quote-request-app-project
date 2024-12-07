import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet,RouterModule  } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AuthService } from './auth.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ReactiveFormsModule } from '@angular/forms'; 
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterModule , RouterLink, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, NzFormModule,NzInputModule,NzButtonModule,ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  isCollapsed = false;

  constructor(public authService: AuthService, private router: Router) {}

  get isMenuVisible() {
    return this.authService.isLoggedIn();
  }

  goToOffer() {
    this.authService.isLoggedIn() && this.router.navigate(['/offer']);
  }

  goToOfferList() {
    this.authService.isLoggedIn() && this.router.navigate(['/offer-list']);
  }

}
