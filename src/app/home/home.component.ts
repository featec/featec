import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MetadataService } from '../services/metadata.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {  

  displayedText = '';
  currentIndex = 0;
  isDeleting = false;
  private typingTimeout: any;
  private dynamicPhrases = ['B2B Operations', 'Distribution', 'Service Marketplace'];

  constructor(
    private metadataService: MetadataService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit() {
    this.metadataService.loadMetadata('home');
    if (isPlatformBrowser(this.platformId)) {
      this.startTyping();
    }
  }

  ngOnDestroy() {
    clearTimeout(this.typingTimeout);
  }

  private startTyping() {
    const current = this.dynamicPhrases[this.currentIndex];

    this.displayedText = this.isDeleting
      ? current.substring(0, this.displayedText.length - 1)
      : current.substring(0, this.displayedText.length + 1);

    let speed = this.isDeleting ? 55 : 95;

    if (!this.isDeleting && this.displayedText === current) {
      speed = 2000;
      this.isDeleting = true;
    } else if (this.isDeleting && this.displayedText === '') {
      this.isDeleting = false;
      this.currentIndex = (this.currentIndex + 1) % this.dynamicPhrases.length;
      speed = 350;
    }

    this.typingTimeout = setTimeout(() => this.startTyping(), speed);
  }
}