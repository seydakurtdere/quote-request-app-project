import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  
  constructor() {
    // Varsayılan mock kullanıcıyı ekliyoruz
    const mockUser: User = { email: 'user@example.com', password: '123456' };
    this.users.push(mockUser); // Mock veriyi kullanıcı listesine ekliyoruz
  }

  // Mock login metodu
  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);
    
    // Kullanıcı doğrulaması
    if (user) {
      this.loggedIn.next(true);
      this.currentUser = user;
      return true;
    }
    return false; // Yanlış giriş
  }

  // Kullanıcı çıkışı (logout)
  logout() {
    this.loggedIn.next(false);
    this.currentUser = { email: '', password: '' };
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
    // Yeni kullanıcıyı oluşturuyoruz
    const newUser: User = { email, password };
    
    // Kullanıcı zaten var mı kontrolü
    const userExists = this.users.some(user => user.email === email);
    
    if (userExists) {
      // Eğer kullanıcı mevcutsa false döndürür
      return false;
    }
        
    // Yeni kullanıcıyı users listesine ekliyoruz
    this.users.push(newUser);
    this.loggedIn.next(true); // Yeni kullanıcı giriş yaptı olarak kabul edilir
    this.currentUser = newUser; // Giriş yapan kullanıcıyı güncelliyoruz
    return true; // Kayıt başarılı
  }
}
