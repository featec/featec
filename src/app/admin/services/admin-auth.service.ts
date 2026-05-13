// src/app/admin/services/admin-auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
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
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('admin_username', username);
          localStorage.setItem('admin_password', password);
          localStorage.setItem('admin_display_name', data.displayName || username);
        }
        return true;
      }
    }
    return false;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('admin_username');
      localStorage.removeItem('admin_password');
      localStorage.removeItem('admin_display_name');
    }
    this.router.navigate(['/admin/login']);
  }

  getUserDisplayName(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('admin_display_name') || 'Admin';
    }
    return 'Admin';
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('admin_username') && !!localStorage.getItem('admin_password');
    }
    return false;
  }
}