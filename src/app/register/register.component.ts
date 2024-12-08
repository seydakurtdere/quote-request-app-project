import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NzFormModule } from 'ng-zorro-antd/form';  
import { NzInputModule } from 'ng-zorro-antd/input';  
import { NzButtonModule } from 'ng-zorro-antd/button';  
import { ReactiveFormsModule } from '@angular/forms';  
import { CommonModule } from '@angular/common';
import { NzModalService } from 'ng-zorro-antd/modal'; 
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,  
  imports: [
    CommonModule,
    NzFormModule,      
    NzInputModule,     
    NzButtonModule,    
    ReactiveFormsModule,
    NzModalModule 
  ],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';  // Hata mesajını tutacağız

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private modal: NzModalService
  ) {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]], // Email doğrulama
        password: ['', [Validators.required, Validators.minLength(6)]], // Şifre doğrulama
        confirmPassword: ['', [Validators.required]], // Şifreyi onaylama alanı
      },
      { validators: this.passwordMatchValidator } // Şifre eşleşmesi validator'ü ekliyoruz
    );
  }

  // Şifre ve onay şifresinin eşleştiğini kontrol eden fonksiyon
  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    // Şifreler eşleşiyorsa null (geçerli), eşleşmiyorsa mismatch hatası döndürülür
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Form submit edildiğinde (onRegister yerine onSubmit kullanıyoruz)
  onSubmit() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      
      // Kullanıcı kaydını AuthService üzerinden gerçekleştiriyoruz
      const registrationSuccess = this.authService.register(email, password);

      if (registrationSuccess) {
        // Kayıt başarılıysa offer sayfasına yönlendiriyoruz
        this.showSuccessModal(); // Modal'ı burada gösteriyoruz
        //this.router.navigate(['/offer']);
      } else {
        // Kayıt başarısızsa hata mesajı veriyoruz
        this.errorMessage = 'A user already exists with this email address!';
      }
    } else {
      this.errorMessage = 'Please fill out the form correctly!';
    }
  }

  // Başarılı işlem sonrası gösterilecek modal
  showSuccessModal(): void {
    this.modal.success({
      nzTitle: 'Success',
      nzContent: 'Your user has been successfully created!',
      nzOnOk: () => this.router.navigate(['/offer']),
    });
  }

}
