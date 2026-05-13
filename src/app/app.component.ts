import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import * as $ from 'jquery';
import { NgwWowService } from 'ngx-wow';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

declare const gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showLayout: boolean = true;

  constructor(
    private wowService: NgwWowService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any // Inject PLATFORM_ID to detect if it's browser
  ) {
    this.wowService.init();
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.router.events.subscribe((event) => {
          // Load script only on the client-side
          if (isPlatformBrowser(this.platformId)) {
            $.getScript('assets/js/main.js');
          }
        });
      }

      if (event instanceof NavigationEnd) {
        // Ensure gtag is only called in the browser
        if (isPlatformBrowser(this.platformId)) {
          gtag('config', 'G-W244LKWRYC', { 'page_path': event.urlAfterRedirects });
        }
      }

      if (event instanceof NavigationError) {
        // Handle navigation errors here if needed
      }
    });
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = this.router.url;
        this.showLayout = !url.includes('unsubscribe') && !url.includes('admin');
      }
    });
  }
}
