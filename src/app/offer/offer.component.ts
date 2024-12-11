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
import { NzModalService } from 'ng-zorro-antd/modal'; 
import { NzModalModule } from 'ng-zorro-antd/modal';

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

interface Cities {
  [key: string]: string[];
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
    NzSelectModule,
    NzModalModule
  ],
})
export class OfferComponent implements OnInit {
  offerForm!: FormGroup; 
  offerList: Offer[] = []; 

  modes = ['LCL', 'FCL', 'Air'];
  movementTypes = ['Door to Door', 'Port to Door', 'Door to Port', 'Port to Port'];
  incoterms = ['DDP', 'DAT'];
  countries = ['USA', 'China', 'Turkey'];
  cities: Cities = {
    'USA': ['New York', 'Los Angeles', 'Miami', 'Minnesota'],
    'China': ['Beijing', 'Shanghai'],
    'Turkey': ['Istanbul', 'Izmir']
  };
  packageTypes = ['Pallets', 'Boxes', 'Cartons'];
  units = ['CM', 'IN'];
  currencies = ['USD', 'CNY', 'TRY'];

  filteredCities: string[] = [];

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private modal: NzModalService) {}

  ngOnInit(): void {
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

  onCountryChange(country: string): void {
    this.filteredCities = this.cities[country] || [];
  }

  convertInchesToCm(inch: number): number {
    return inch * 2.54;
  }

  calculateBoxCount(cartonWidth: number, cartonLength: number, cartonHeight: number, boxWidth: number, boxLength: number, boxHeight: number): number {
    const boxesInWidth = Math.floor(boxWidth / cartonWidth);
    const boxesInLength = Math.floor(boxLength / cartonLength);
    const boxesInHeight = Math.floor(boxHeight / cartonHeight);
    return boxesInWidth * boxesInLength * boxesInHeight;
  }

  onSubmit() {
    if (this.offerForm.valid) {
      const offerData = this.offerForm.value;

      const unit1ValueInCm = this.convertInchesToCm(parseFloat(offerData.unit1));
      const unit2ValueInCm = this.convertInchesToCm(parseFloat(offerData.unit2));

      offerData.amount = unit1ValueInCm * unit2ValueInCm;

      offerData.email = this.authService.getUser().email;

      this.authService.updateOfferList(offerData);

      this.showSuccessModal();
      this.offerForm.reset();
    } else {
      console.log('Form is invalid');
    }
  }

  showSuccessModal(): void {
    this.modal.success({
      nzTitle: 'Success',
      nzContent: 'Your offer has been successfully created!',
      nzOnOk: () => {},
    });
  }
}
