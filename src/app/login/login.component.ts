import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service'; 
import { NzFormModule } from 'ng-zorro-antd/form';  
import { NzInputModule } from 'ng-zorro-antd/input'; 
import { NzButtonModule } from 'ng-zorro-antd/button';  
import { ReactiveFormsModule } from '@angular/forms';  
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,  
  imports: [
    CommonModule,
    NzFormModule,     
    NzInputModule,     
    NzButtonModule,   
    ReactiveFormsModule,
    RouterLink
  ],
})
export class LoginComponent {
  loginForm: FormGroup; 
  errorMessage: string = '';  

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Formu oluşturuyoruz
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Email zorunlu ve geçerli olmalı
      password: ['', [Validators.required, Validators.minLength(6)]] // Şifre zorunlu ve en az 6 karakter olmalı
    });
  }

  ngOnInit(): void {
    // Eğer kullanıcı zaten giriş yaptıysa login sayfasına gitmesine izin vermeyelim
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/offer']);
    }
  }

  // Form submit edildiğinde
  onSubmit(): void {
    if (this.loginForm.valid) {
      // AuthService ile login işlemi
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      const loginSuccess = this.authService.login(email, password);

      if (loginSuccess) {
        // Giriş başarılıysa modal'ı göster ve /offer sayfasına yönlendiriyoruz
        this.router.navigate(['/offer']);
      } else {
        // Giriş başarısızsa hata mesajı göster
        this.errorMessage = 'Invalid email or password';
      }
    } else {
      // Hata durumunda kullanıcıya mesaj verebilirsiniz
      this.errorMessage = 'Please fill in the form correctly!';
    }
  }
}
