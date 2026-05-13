// src/app/blog-detail/blogdetail.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml, Title, Meta } from '@angular/platform-browser';
import { BlogService, BlogPost } from '../services/blog.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blogdetail.component.html',
  styleUrls: ['./blogdetail.component.scss']
})
export class BlogDetailComponent implements OnInit, OnDestroy {

  blog: BlogPost = null;
  latestBlogs: BlogPost[] = [];
  safeContent: SafeHtml = null;
  loading = true;
  readingProgress = 0;
  readingTime = 0;
  private scrollObserver: IntersectionObserver | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private titleService: Title,
    private metaService: Meta
  ) { }

  private lastScrollTop = 0;

  initHeaderAnimations(): void {
    const headerEls = document.querySelectorAll(
      '.article-category, .article-title, .article-meta, .article-excerpt, .article-featured-image'
    );

    const navbar = document.querySelector('nav.custom-nav') as HTMLElement;
    const navbarHeight = navbar ? navbar.offsetHeight : 80;

    const headerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('header-visible');
          entry.target.classList.remove('header-hidden');
          // Once visible, stop observing to prevent flickering/re-triggering
          headerObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: `-${navbarHeight + 10}px 0px -20px 0px`
    });

    headerEls.forEach((el, index) => {
      el.classList.add('header-hidden');
      // Stagger each element slightly
      (el as HTMLElement).style.animationDelay = `${index * 0.1}s`;
      headerObserver.observe(el);
    });
  }

  initScrollAnimations(): void {
    const targets = document.querySelectorAll('.article-body > *');

    // Dynamically get the navbar height so the observer accounts for it
    const navbar = document.querySelector('nav.custom-nav') as HTMLElement;
    const navbarHeight = navbar ? navbar.offsetHeight : 80;
    const topMargin = `-${navbarHeight + 20}px`; // navbar height + 20px breathing room

    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-visible');
          entry.target.classList.remove('scroll-hidden');
          // Once shown, stop observing so it stays locked in place
          this.scrollObserver?.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: `${topMargin} 0px -40px 0px`  // ← was hardcoded -80px, now dynamic
    });

    targets.forEach(el => {
      el.classList.add('scroll-hidden');
      this.scrollObserver!.observe(el);
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (!slug) {
        this.router.navigate(['/blog']);
        return;
      }

      this.loading = true;

      this.blogService.getBlogBySlug(slug).subscribe(blogs => {
        if (blogs.length > 0) {
          this.blog = blogs[0];
          this.safeContent = this.sanitizer.bypassSecurityTrustHtml(this.blog.content || '');

          // Use Admin defined Reading Time
          this.readingTime = this.blog.readingTime || 0;

          // Apply Admin SEO Metadata
          const seoTitle = this.blog.metaTitle || `${this.blog.title} | Featec Blog`;
          const seoDesc = this.blog.metaDescription || this.blog.excerpt;
          const seoKeywords = this.blog.metaKeywords || (this.blog.tags ? this.blog.tags.join(', ') : '');

          this.titleService.setTitle(seoTitle);
          this.metaService.updateTag({ name: 'description', content: seoDesc });
          this.metaService.updateTag({ name: 'keywords', content: seoKeywords });

          // Social Media / OpenGraph (Premium share preview)
          this.metaService.updateTag({ property: 'og:title', content: seoTitle });
          this.metaService.updateTag({ property: 'og:description', content: seoDesc });
          this.metaService.updateTag({ property: 'og:image', content: this.blog.featuredImage });

          // Fetch latest blogs for sidebar
          this.blogService.getAllPublishedBlogs().subscribe(allBlogs => {
            this.latestBlogs = allBlogs.filter(b => b.id !== this.blog.id).slice(0, 3);
          });

          // Track Reading Progress
          window.addEventListener('scroll', this.updateProgress.bind(this));

          setTimeout(() => {
            this.initScrollAnimations();
            this.initHeaderAnimations();
          }, 100);

          // Wait for content to render
        } else {
          this.router.navigate(['/blog']);
        }
        this.loading = false;
      });
    });
  }

  ngOnDestroy(): void {
    this.scrollObserver?.disconnect();
    window.removeEventListener('scroll', this.updateProgress.bind(this));
  }

  updateProgress(): void {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) {
      this.readingProgress = 0;
      return;
    }
    const progress = (window.scrollY / totalHeight) * 100;
    this.readingProgress = Math.min(100, Math.max(0, progress));
  }

  share(platform: string): void {
    const url = window.location.href;
    const title = this.blog?.title || 'Check out this article';
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  }

  copyLink(): void {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      // Assuming toastr is available via constructor
      if (this.toastr?.success) {
        this.toastr.success('Link copied to clipboard!');
      } else {
        alert('Link copied to clipboard!');
      }
    });
  }

  formatDate(timestamp: any): string {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
