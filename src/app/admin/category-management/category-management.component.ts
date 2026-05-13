// src/app/admin/category-management/category-management.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminCategoryService } from '../services/admin-category.service';
import { Category } from '../models/category.model';
import { AdminBlogService } from '../services/admin-blog.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnInit, OnDestroy {

  categories: Category[] = [];
  loading = true;
  newCategoryName = '';
  addingCategory = false;
  searchTerm = '';
  private destroy$ = new Subject<void>();

  constructor(
    private categoryService: AdminCategoryService,
    private blogService: AdminBlogService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategories(): void {
    this.categoryService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(categories => {
        this.categories = categories;
        this.loading = false;
      });
  }

  addCategory(): void {
    if (!this.newCategoryName.trim()) {
      this.toastr.warning('Please enter a category name');
      return;
    }

    // Check for duplicate
    const exists = this.categories.some(c => 
      c.name.toLowerCase() === this.newCategoryName.trim().toLowerCase()
    );

    if (exists) {
      this.toastr.error('This category already exists!', 'Duplicate Entry');
      return;
    }

    this.addingCategory = true;
    this.categoryService.createCategory(this.newCategoryName)
      .then(() => {
        this.toastr.success('Category added successfully!');
        this.newCategoryName = '';
      })
      .catch(err => {
        this.toastr.error('Error adding category: ' + err.message);
      })
      .finally(() => {
        this.addingCategory = false;
      });
  }

  async deleteCategory(id: string, name: string): Promise<void> {
    const inUse = await this.blogService.isCategoryInUse(name);
    
    if (inUse) {
      this.toastr.error(`Cannot delete "${name}" because it is currently being used by one or more blog posts.`, 'Permission Denied');
      return;
    }

    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      this.categoryService.deleteCategory(id)
        .then(() => this.toastr.success('Category deleted!'))
        .catch(err => this.toastr.error('Error deleting category: ' + err.message));
    }
  }

  get filteredCategories(): Category[] {
    if (!this.searchTerm) return this.categories;
    const term = this.searchTerm.toLowerCase().trim();
    return this.categories.filter(cat => 
      cat.name.toLowerCase().includes(term) || 
      (cat.slug && cat.slug.toLowerCase().includes(term))
    );
  }
}
