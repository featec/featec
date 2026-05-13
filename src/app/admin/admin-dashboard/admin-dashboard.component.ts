// src/app/admin/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { AdminBlogService } from '../services/admin-blog.service';
import { AdminAuthService } from '../services/admin-auth.service';
import { BlogPost } from '../models/blog-post.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  totalBlogs = 0;
  publishedBlogs = 0;
  scheduledBlogs = 0;
  draftBlogs = 0;
  recentBlogs: BlogPost[] = [];
  categories: any[] = [];

  constructor(
    private blogService: AdminBlogService,
    public authService: AdminAuthService
  ) {}

  ngOnInit(): void {
    this.blogService.getAllBlogs().subscribe(blogs => {
      this.totalBlogs = blogs.length;
      this.publishedBlogs = blogs.filter(b => b.status === 'published' || this.isScheduledPublished(b)).length;
      this.scheduledBlogs = blogs.filter(b => b.status === 'scheduled' && !this.isScheduledPublished(b)).length;
      this.draftBlogs = blogs.filter(b => b.status === 'draft').length;
      this.recentBlogs = blogs.slice(0, 5);
    });

    this.blogService.getCategories().subscribe(cats => {
      this.categories = cats;
    });
  }

  isScheduledPublished(blog: BlogPost): boolean {
    return blog.status === 'scheduled' && !!blog.scheduledDate && new Date(blog.scheduledDate) <= new Date();
  }
}