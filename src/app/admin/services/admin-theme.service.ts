import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminThemeService {
  constructor() {
    this.applyFixedTheme();
  }

  private applyFixedTheme(): void {
    // Premium Soft Dimmed Theme
    const primary = '#3b82f6';    // Bright Blue
    const primaryDark = '#2563eb'; // Strong Blue
    const bg = '#1c2128';         // Dimmed Graphite (Easy on eyes)
    const cardBg = '#22272e';     // Slightly darker card
    const sidebar = '#1c2128';    // Matching sidebar
    const text = '#adbac7';       // Soft Grey-Blue Text
    const textMuted = '#768390';  // Muted Dimmed Text
    const border = 'rgba(144, 157, 171, 0.12)'; 
    
    document.documentElement.style.setProperty('--admin-primary', primary);
    document.documentElement.style.setProperty('--admin-primary-dark', primaryDark);
    document.documentElement.style.setProperty('--admin-primary-glow', 'rgba(59, 130, 246, 0.15)');
    document.documentElement.style.setProperty('--admin-bg', bg);
    document.documentElement.style.setProperty('--admin-bg-alt', cardBg);
    document.documentElement.style.setProperty('--admin-bg-sidebar', sidebar);
    document.documentElement.style.setProperty('--admin-border', border);
    document.documentElement.style.setProperty('--admin-text', text);
    document.documentElement.style.setProperty('--admin-text-muted', textMuted);
    
    // Dimmed Effects
    document.documentElement.style.setProperty('--admin-glass', 'rgba(34, 39, 46, 0.8)');
    document.documentElement.style.setProperty('--admin-glass-border', 'rgba(144, 157, 171, 0.1)');
    document.documentElement.style.setProperty('--admin-card-shadow', '0 8px 24px rgba(0, 0, 0, 0.2)');
    document.documentElement.style.setProperty('--admin-font-main', "'Inter', 'Plus Jakarta Sans', sans-serif");
  }

  setThemeColor(color: string): void { }
  setBgColor(color: string): void { }
  getStoredColor(): string { return '#3b82f6'; }
  getStoredBgColor(): string { return '#0f172a'; }
}
