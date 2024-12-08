import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NzFormModule } from 'ng-zorro-antd/form';  
import { NzInputModule } from 'ng-zorro-antd/input'; 
import { NzButtonModule } from 'ng-zorro-antd/button';  
import { ReactiveFormsModule } from '@angular/forms';  
import { CommonModule } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';

interface Offer {
  mode: string;
  movementType: string;
  incoterms: string;
  country: string;
  city: string;
  packageType: string;
  unit1: string;
  unit2: string;
  currency: string;
  amount: number; 
  email: string; 
}

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss'],
  standalone: true,  
  imports: [
    CommonModule,
    NzFormModule,     
    NzInputModule,     
    NzButtonModule,   
    ReactiveFormsModule,
    NzSelectModule
  ],
})
export class OfferComponent implements OnInit {
  offerForm!: FormGroup;  // FormGroup özelliği
  offerList: Offer[] = []; 

  // Sabit veriler
  modes = ['LCL', 'FCL', 'Air'];
  movementTypes = ['Door to Door', 'Port to Door', 'Door to Port', 'Port to Port'];
  incoterms = ['DDP', 'DAT'];
  countries = ['USA', 'China', 'Turkey'];
  packageTypes = ['Pallets', 'Boxes', 'Cartons'];
  units = ['CM', 'IN'];
  currencies = ['USD', 'CNY', 'TRY'];

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Formu başlatıyoruz
    this.offerForm = this.fb.group({
      mode: ['', Validators.required],
      movementType: ['', Validators.required],
      incoterms: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      packageType: ['', Validators.required],
      unit1: ['', Validators.required],
      unit2: ['', Validators.required],
      currency: ['', Validators.required]
    });
  }

  // Form submit edildiğinde bu fonksiyon çalışacak
  onSubmit() {
    if (this.offerForm.valid) {
      const offerData = this.offerForm.value;

      // Hesaplama işlemi (unit1 ve unit2'nin çarpımı)
      const unit1Value = parseFloat(offerData.unit1);  // unit1'i sayıya dönüştürüyoruz
      const unit2Value = parseFloat(offerData.unit2);  // unit2'yi sayıya dönüştürüyoruz

      if (!isNaN(unit1Value) && !isNaN(unit2Value)) {
        offerData.amount = unit1Value * unit2Value;  // Çarpma işlemi
      } else {
        offerData.amount = 0;  // Eğer NaN ise, amount'u 0 olarak ayarlıyoruz
      }

      // Kullanıcının email bilgisini ekliyoruz
      offerData.email = this.authService.getUser().email;

      this.authService.updateOfferList(offerData);  // Mock veri listesine ekliyoruz

      console.log(this.offerList);  // Konsola yazdırıyoruz

      // Formu sıfırlıyoruz
      this.offerForm.reset();

    } else {
      console.log('Form is invalid');
    }
  }
}
