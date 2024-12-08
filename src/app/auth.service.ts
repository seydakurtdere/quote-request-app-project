import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

// Kullanıcı nesnesinin tipi (interface)
interface User {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false); // Kullanıcı giriş durumu
  currentUser: User = { email: '', password: '' }; // Giriş yapmış kullanıcı bilgisi
  users: User[] = []; // Mock kullanıcı listesi
  private offerListSource = new BehaviorSubject<any[]>([]);  // Başlangıçta boş bir liste
  currentOfferList = this.offerListSource.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {
    this.loadUserFromLocalStorage();
    this.loadOfferListFromLocalStorage();
  }

  // LocalStorage'dan kullanıcıyı yükle
  private loadUserFromLocalStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('currentUser');
      const loginTime = localStorage.getItem('loginTime');

      if (savedUser && loginTime) {
        const user = JSON.parse(savedUser);
        const timeElapsed = Date.now() - parseInt(loginTime);

        if (timeElapsed < 3600000) { // 1 saat (3600000 ms) kontrolü
          this.loggedIn.next(true);
          this.currentUser = user;
        } else {
          this.logout(); // Süre dolmuşsa logout işlemi yapılır
        }
      } else {
        // Varsayılan mock kullanıcıyı ekliyoruz
        const mockUser: User = { email: 'user@example.com', password: '123456' };
        this.users.push(mockUser);
      }
    }
  }

  // LocalStorage'dan offerList'i yükle
  private loadOfferListFromLocalStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const savedOffers = localStorage.getItem('offerList');
      if (savedOffers) {
        this.offerListSource.next(JSON.parse(savedOffers)); // Teklifleri localStorage'tan alıyoruz
      }
    }
  }

  // Mock login metodu
  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);

    if (user) {
      this.loggedIn.next(true);
      this.currentUser = user;

      // Kullanıcıyı localStorage'a kaydediyoruz
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('loginTime', Date.now().toString());  // Giriş zamanını kaydediyoruz
      }

      return true;
    }
    return false;
  }

  // Kullanıcı çıkışı (logout)
  logout() {
    this.loggedIn.next(false);
    this.currentUser = { email: '', password: '' };

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('loginTime');
    }
  }

  // Kullanıcı giriş durumu kontrolü
  isLoggedIn(): boolean {
    return this.loggedIn.getValue();
  }

  // Kullanıcı bilgisi
  getUser() {
    return this.currentUser;
  }

  // Yeni kullanıcı kaydetme (register methodu)
  register(email: string, password: string): boolean {
    const newUser: User = { email, password };

    // Kullanıcı zaten var mı kontrolü
    const userExists = this.users.some(user => user.email === email);

    if (userExists) {
      return false;
    }

    // Yeni kullanıcıyı users listesine ekliyoruz
    this.users.push(newUser);
    this.loggedIn.next(true);
    this.currentUser = newUser;

    // Yeni kullanıcıyı localStorage'a kaydediyoruz
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      localStorage.setItem('loginTime', Date.now().toString());  // Giriş zamanını kaydediyoruz
    }

    return true;
  }

  // Teklif listesini güncelleme ve localStorage'a kaydetme
  updateOfferList(offer: any) {
    const currentList = this.offerListSource.value;
    currentList.push(offer);  // Yeni veriyi mevcut listeye ekliyoruz
    this.offerListSource.next(currentList);

    // Teklifleri localStorage'a kaydediyoruz
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('offerList', JSON.stringify(currentList));
    }
  }

  // Sayfaların erişimi kontrolü (canActivate)
  canActivate(): boolean {
    if (this.isLoggedIn()) {
      return true;
    } else {
      // Giriş yapılmamışsa login sayfasına yönlendir
      this.router.navigate(['/login']);
      return false;
    }
  }
}
