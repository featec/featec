// src/app/admin/blog-management/blog-list/blog-list.component.ts
import { Component, OnInit } from '@angular/core';
import { AdminBlogService } from '../../services/admin-blog.service';
import { BlogPost } from '../../models/blog-post.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {

  blogs: BlogPost[] = [];
  categories: any[] = [];
  loading = true;
  private _searchTerm = '';
  get searchTerm(): string { return this._searchTerm; }
  set searchTerm(val: string) {
    this._searchTerm = val;
    this.currentPage = 1;
  }

  private _selectedCategory = '';
  get selectedCategory(): string { return this._selectedCategory; }
  set selectedCategory(val: string) {
    this._selectedCategory = val;
    this.currentPage = 1;
  }

  // Pagination
  currentPage = 1;
  pageSize = 15;
  pageSizeOptions = [15, 25, 50, 100];

  constructor(
    private blogService: AdminBlogService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.blogService.getAllBlogs().subscribe(blogs => {
      this.blogs = blogs;
      this.loading = false;
    });

    this.blogService.getCategories().subscribe(cats => {
      this.categories = cats;
    });
  }


  get allFilteredBlogs(): BlogPost[] {
    let filtered = this.blogs;

    if (this.selectedCategory) {
      filtered = filtered.filter(blog => blog.category === this.selectedCategory);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(term) ||
        blog.category.toLowerCase().includes(term) ||
        (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }

    return filtered;
  }

  get paginatedBlogs(): BlogPost[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.allFilteredBlogs.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.allFilteredBlogs.length / this.pageSize);
  }

  get totalResults(): number {
    return this.allFilteredBlogs.length;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1; // Reset to first page when size changes
  }

  isScheduledPublished(blog: BlogPost): boolean {
    return blog.status === 'scheduled' && !!blog.scheduledDate && new Date(blog.scheduledDate) <= new Date();
  }

  deleteBlog(id: string): void {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.blogService.deleteBlog(id)
        .then(() => this.toastr.success('Blog deleted!', 'Success'))
        .catch(err => this.toastr.error(err.message, 'Error'));
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
  }
}