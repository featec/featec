// src/app/admin/services/admin-auth.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {

  constructor(
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  async login(username: string, password: string): Promise<boolean> {
    const snapshot = await this.firestore
      .collection('admin_users', ref => ref.where('username', '==', username))
      .get()
      .toPromise();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data() as { username: string; password: string; displayName: string };
      
      if (data.password === password) {
        localStorage.setItem('admin_username', username);
        localStorage.setItem('admin_password', password);
        localStorage.setItem('admin_display_name', data.displayName || username);
        return true;
      }
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('admin_username');
    localStorage.removeItem('admin_password');
    localStorage.removeItem('admin_display_name');
    this.router.navigate(['/admin/login']);
  }

  getUserDisplayName(): string {
    return localStorage.getItem('admin_display_name') || 'Admin';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('admin_username') && !!localStorage.getItem('admin_password');
  }
}