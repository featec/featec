// src/app/admin/admin-layout/admin-layout.component.ts
import { Component } from '@angular/core';
import { AdminAuthService } from '../services/admin-auth.service';
import { AdminThemeService } from '../services/admin-theme.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  mobileSidebarOpen = false;

  constructor(
    public authService: AdminAuthService,
    private themeService: AdminThemeService
  ) {}

  logout(): void {
    this.authService.logout();
  }
}
