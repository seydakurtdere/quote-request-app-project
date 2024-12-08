import { Component, OnInit } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';  
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.scss'],
  standalone: true,
  imports: [NzTableModule, CommonModule]
})
export class OfferListComponent implements OnInit {
  offerList: any[] = []; 

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Servisten veri alıyoruz
    this.authService.currentOfferList.subscribe(data => {
      this.offerList = data;  // Veriyi offerList'e atıyoruz
    });
  }
}
