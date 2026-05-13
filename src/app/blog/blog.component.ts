// src/app/blog/blog.component.ts
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { BlogService, BlogPost } from '../services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit, OnDestroy {
  @ViewChild('categoryScroll') categoryScroll: ElementRef;

  private blogObserver: IntersectionObserver | null = null;

  allBlogs: BlogPost[] = [];
  pagedBlogs: BlogPost[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 12;

  categories: any[] = [];
  selectedCategory = 'All';
  searchTerm = '';
  filteredBlogs: BlogPost[] = [];

  categoryScrollIndices: { [key: string]: number } = {};
  private rotationInterval: any;

  // Responsive carousel items count
  visibleItems = 3;

  constructor(private blogService: BlogService) { }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateVisibleItems();
  }

  private lastScrollTop = 0;

  initScrollAnimations(): void {
    const navbar = document.querySelector('nav.custom-nav') as HTMLElement;
    const navbarHeight = navbar ? navbar.offsetHeight : 80;

    this.blogObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('blog-anim-visible');
          entry.target.classList.remove('blog-anim-hidden');
        } else {
          // Reset only when element scrolls back above viewport (scroll up reset)
          if (entry.boundingClientRect.top > 0) {
            entry.target.classList.add('blog-anim-hidden');
            entry.target.classList.remove('blog-anim-visible');
          }
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: `-${navbarHeight + 10}px 0px -30px 0px`
    });

    // Observe different element types
    const targets = document.querySelectorAll(
      '.section-header, .blog-controls, .blog-card, .category-group, .mini-card, .pagination'
    );

    targets.forEach((el, index) => {
      el.classList.add('blog-anim-hidden');
      // Stagger cards in the same row
      if (el.classList.contains('blog-card') || el.classList.contains('mini-card')) {
        (el as HTMLElement).style.transitionDelay = `${(index % 3) * 0.1}s`;
      }
      this.blogObserver!.observe(el);
    });

    // Header Hide Logic on Scroll Up
    window.addEventListener('scroll', () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      const header = document.querySelector('header');

      if (header) {
        if (st < this.lastScrollTop) {
          // Scroll Up -> Hide Header
          header.style.transform = 'translateY(-100%)';
          header.style.transition = 'transform 0.4s ease';
        } else {
          // Scroll Down -> Show Header
          header.style.transform = 'translateY(0)';
        }
      }
      this.lastScrollTop = st <= 0 ? 0 : st;
    }, { passive: true });
  }

  reObserveNewCards(): void {
    // Called after filter/pagination to observe newly rendered cards
    const navbar = document.querySelector('nav.custom-nav') as HTMLElement;
    const navbarHeight = navbar ? navbar.offsetHeight : 80;

    const cards = document.querySelectorAll('.blog-card, .mini-card');
    cards.forEach((el, index) => {
      if (!el.classList.contains('blog-anim-hidden') && !el.classList.contains('blog-anim-visible')) {
        el.classList.add('blog-anim-hidden');
        (el as HTMLElement).style.transitionDelay = `${(index % 3) * 0.1}s`;
        this.blogObserver?.observe(el);
      }
    });
  }

  ngOnInit(): void {
    this.updateVisibleItems();
    this.fetchBlogs();
    this.fetchCategories();
  }

  fetchBlogs(): void {
    this.loading = true;
    this.blogService.getAllPublishedBlogs().subscribe(blogs => {
      this.allBlogs = blogs;
      this.applyFilter(this.selectedCategory);
      this.loading = false;

      // Critical: Wait for Angular to finish rendering the list before observing
      setTimeout(() => {
        this.initScrollAnimations();
      }, 400);
    });
  }

  fetchCategories(): void {
    this.blogService.getCategories().subscribe(cats => {
      this.categories = [{ name: 'All' }, ...cats];
      this.startAutoScroll();
    });
  }

  ngOnDestroy(): void {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
    }
    this.blogObserver?.disconnect();
  }

  updateVisibleItems(): void {
    const width = window.innerWidth;
    if (width < 800) {
      this.visibleItems = 1;
    } else if (width < 1200) {
      this.visibleItems = 2;
    } else {
      this.visibleItems = 3;
    }

    // Reset indices that might now be out of bounds after resize
    Object.keys(this.categoryScrollIndices).forEach(cat => {
      const blogs = this.getBlogsByCategory(cat);
      const maxIndex = Math.max(0, blogs.length - this.visibleItems);
      if (this.categoryScrollIndices[cat] > maxIndex) {
        this.categoryScrollIndices[cat] = 0;
      }
    });
  }


  startAutoScroll(): void {
    this.rotationInterval = setInterval(() => {
      this.categories.forEach(cat => {
        if (cat.name === 'All') return;
        const blogs = this.getBlogsByCategory(cat.name);

        // Only scroll if there are more blogs than what's visible
        if (blogs.length > this.visibleItems) {
          const currentIndex = this.categoryScrollIndices[cat.name] || 0;
          const maxIndex = blogs.length - this.visibleItems;

          if (currentIndex >= maxIndex) {
            this.categoryScrollIndices[cat.name] = 0;
          } else {
            this.categoryScrollIndices[cat.name] = currentIndex + 1;
          }
        } else {
          // Reset index if blogs are fewer than visible items (e.g. after resize)
          this.categoryScrollIndices[cat.name] = 0;
        }
      });
    }, 5000);
  }

  getScrollTransform(category: string): string {
    const index = this.categoryScrollIndices[category] || 0;
    const shift = 100 / this.visibleItems;
    return `translateX(-${index * shift}%)`;
  }

  applyFilter(category: string = this.selectedCategory): void {
    this.selectedCategory = category;
    this.currentPage = 1;

    let results = this.allBlogs;

    if (category !== 'All') {
      results = results.filter(blog => blog.category === category);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      results = results.filter(blog =>
        blog.title.toLowerCase().includes(term) ||
        blog.excerpt.toLowerCase().includes(term)
      );
    }

    this.filteredBlogs = results;
    this.updatePagedBlogs();
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.applyFilter();
    setTimeout(() => this.reObserveNewCards(), 100);
  }

  scrollCategories(amount: number): void {
    if (this.categoryScroll) {
      this.categoryScroll.nativeElement.scrollBy({
        left: amount,
        behavior: 'smooth'
      });
    }
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedBlogs();
      this.scrollToTop();
    }
  }

  updatePagedBlogs(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.pagedBlogs = this.filteredBlogs.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredBlogs.length / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getBlogsByCategory(category: string): BlogPost[] {
    return this.allBlogs.filter(blog => blog.category === category);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  formatDate(timestamp: any): string {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  trackByBlogId(index: number, blog: any): string {
    return blog.id || blog.slug;
  }
}
