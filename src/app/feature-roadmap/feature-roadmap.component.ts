import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AdminFeatureService, RoadmapFeature } from '../admin/services/admin-feature.service';

export interface DisplayFeature extends RoadmapFeature {
  safeImages?: SafeUrl[];
}

@Component({
  selector: 'app-feature-roadmap',
  templateUrl: './feature-roadmap.component.html',
  styleUrls: ['./feature-roadmap.component.scss']
})
export class FeatureRoadmapComponent implements OnInit {
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scroll = window.pageYOffset;
    document.documentElement.style.setProperty('--scroll-y', `${scroll}px`);
    this.updateParallax(scroll);
  }

updateParallax(scroll: number): void {
  const totalH = document.body.scrollHeight - window.innerHeight;
  const progress = totalH > 0 ? scroll / totalH : 0;
  document.documentElement.style.setProperty('--scroll-progress', `${progress}`);
  document.documentElement.style.setProperty('--scroll-px', `${scroll}px`);
}

getSeasonClass(index: number): string {
  const seasons = ['season-spring', 'season-summer', 'season-autumn', 'season-winter'];
  const seasonIndex = Math.floor(index / 3) % 4;
  return seasons[seasonIndex];
}

private currentSeason: string | null = null;

initSeasonBg(): void {
  const stops = document.querySelectorAll<HTMLElement>('.rm-stop');
  if (!stops.length) return;

  const layerMap: Record<string, HTMLElement | null> = {
    'season-spring': document.querySelector('.rm-sky-spring'),
    'season-summer': document.querySelector('.rm-sky-summer'),
    'season-autumn': document.querySelector('.rm-sky-autumn'),
    'season-winter': document.querySelector('.rm-sky-winter'),
  };

  const showSeason = (season: string) => {
    if (this.currentSeason === season) return;
    this.currentSeason = season;

    Object.entries(layerMap).forEach(([key, el]) => {
      if (!el) return;
      el.style.opacity = key === season ? '1' : '0';
    });
  };

  // Show spring by default
  showSeason('season-spring');

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const season = (e.target as HTMLElement).dataset['season'];
        if (season) showSeason(season);
      });
    },
    { threshold: 0.15 }
  );

  stops.forEach(el => io.observe(el));
}
  
  features: DisplayFeature[] = [];
  loading = true;
  moduleActive = true; // Global toggle for the module

  // SVG road
  svgViewBox = '0 0 1000 1000';
  roadBody = '';
  roadEdge = '';
  roadDash = '';
  stopCircles: { cx: number; cy: number; label: string }[] = [];

  private readonly CX = 500;   // centre x of SVG (viewBox width = 1000)
  private readonly LX = 300;   // Moved further left to match the RX symmetry
  private readonly RX = 700;   // Kept as 700 (perfect for even features)
  private readonly GAP = 700;   // SVG units between stops (increased for longer journey)
  private readonly TOP = 80;
  private readonly BOT = 180;

  constructor(
    private svc: AdminFeatureService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    // Check if module is active globally
    this.svc.getModuleStatus().subscribe(status => {
      this.moduleActive = status;
      this.cdr.detectChanges();
    });

    this.svc.getAllFeatures().subscribe(data => {
      this.features = data.filter(f => f.isActive).map(f => {
        const images = f.images || [];
        return {
          ...f,
          safeImages: images.map(img => this.sanitizer.bypassSecurityTrustUrl(img))
        };
      });
      this.loading = false;
      this.buildRoad();
      this.cdr.detectChanges();

      // Initialize image rotation for multi-image features
      // this.startImageRotation();

      setTimeout(() => {
  this.initAnims();
  this.initSeasonBg();
}, 350);
    });
  }

  // To track current image index for each feature
  currentImageIndices: { [key: string]: number } = {};

  startImageRotation(): void {
    setInterval(() => {
      this.features.forEach(f => {
        const id = f.id || f.title;
        if (f.safeImages && f.safeImages.length > 1) {
          const currentIndex = this.currentImageIndices[id] || 0;
          this.currentImageIndices[id] = (currentIndex + 1) % f.safeImages.length;
        }
      });
      this.cdr.detectChanges();
    }, 4000);
  }

  padNumber(n: number): string { return String(n).padStart(2, '0'); }

  buildRoad(): void {
    const n = this.features.length;
    if (!n) return;

    const H = this.TOP + n * this.GAP + this.BOT;
    this.svgViewBox = `0 0 1000 ${H}`;

    const pts: { x: number; y: number }[] = [];
    // Start point
    pts.push({ x: this.CX, y: this.TOP });

    for (let i = 0; i < n; i++) {
      const x = i % 2 === 0 ? this.LX : this.RX;
      const y = this.TOP + (i + 0.5) * this.GAP;
      pts.push({ x, y });
    }
    // End point
    pts.push({ x: this.CX, y: H - 40 });

    // Build smooth cubic bezier path through all points
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i - 1];
      const c = pts[i];
      const hy = (p.y + c.y) / 2;
      d += ` C ${p.x},${hy} ${c.x},${hy} ${c.x},${c.y}`;
    }

    this.roadBody = d;
    this.roadEdge = d;
    this.roadDash = d;

    // Stop circles (skip start & end sentinel points)
    this.stopCircles = pts.slice(1, pts.length - 1).map((p, i) => ({
      cx: p.x, cy: p.y,
      label: this.padNumber(i + 1)
    }));
  }

  initAnims(): void {
    const els = document.querySelectorAll<HTMLElement>('.rm-stop');
    if (!els.length) return;

    const navbar = document.querySelector('nav.custom-nav') as HTMLElement;
    const navbarHeight = navbar ? navbar.offsetHeight : 80;

    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('rm-anim-visible');
          e.target.classList.remove('rm-anim-hidden');
        } else {
          // Reset when scrolled back above viewport
          if (e.boundingClientRect.top > 0) {
            e.target.classList.add('rm-anim-hidden');
            e.target.classList.remove('rm-anim-visible');
          }
        }
      }),
      {
        threshold: 0.1,
        rootMargin: `-${navbarHeight}px 0px -50px 0px`
      }
    );

    els.forEach((el, i) => {
      el.classList.add('rm-anim-hidden');
      io.observe(el);
    });
  }
}