import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminMetadataService } from '../services/admin-metadata.service';
import { AdminAuthService } from '../services/admin-auth.service';
import { AdminCategoryService } from '../services/admin-category.service';
import { Category } from '../models/category.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-metadata-management',
  templateUrl: './metadata-management.component.html',
  styleUrls: ['./metadata-management.component.scss']
})
export class MetadataManagementComponent implements OnInit {

  pages = [
    { slug: 'home', label: 'Home' },
    { slug: 'about', label: 'About' },
    { slug: 'services', label: 'Services' },
    { slug: 'product', label: 'Product' },
    { slug: 'blog', label: 'Blog' },
    { slug: 'contact', label: 'Contact' },
    { slug: 'sfa', label: 'SFA' },
    { slug: 'dms', label: 'DMS' },
    { slug: 'database', label: 'Database Service' },
    { slug: 'eretail', label: 'E-Retail' },
    { slug: 'project-mgmt', label: 'Project Management' },
  ];

  selectedPage: string = 'home';
  selectedPageLabel: string = 'Home';
  metaForm: FormGroup;
  loading = false;
  saving = false;
  savedData: any = null;
  recentlyUpdatedFields: string[] = [];
  
  categories: Category[] = [];
  categoryLoading = false;

  constructor(
    private fb: FormBuilder,
    private metadataService: AdminMetadataService,
    public authService: AdminAuthService,
    private toastr: ToastrService,
    private categoryService: AdminCategoryService
  ) { }

  ngOnInit(): void {
    // Removed Validators.required so users can submit partial data
    this.metaForm = this.fb.group({
      title: [''],
      description: [''],
      keywords: ['']
    });

    this.loadPageMeta(this.selectedPage);
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryLoading = true;
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
      this.categoryLoading = false;
    });
  }

  deleteCategory(id: string, name: string): void {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      this.categoryService.deleteCategory(id)
        .then(() => this.toastr.success('Category deleted!'))
        .catch(err => this.toastr.error('Error deleting category: ' + err.message));
    }
  }

  loadPageMeta(slug: string): void {
    const page = this.pages.find(p => p.slug === slug);
    this.selectedPage = slug;
    this.selectedPageLabel = page ? page.label : slug;
    this.loading = true;
    this.savedData = null;
    this.metaForm.reset();
    
    // ✅ Clear the green highlight when switching pages
    this.recentlyUpdatedFields = [];

    this.metadataService.getPageMeta(slug).subscribe(data => {
      if (data) {
        this.savedData = data;
        // // Pre-fill form with existing data so a partial update keeps the rest
        // this.metaForm.patchValue({
        //   title: data.title || '',
        //   description: data.description || '',
        //   keywords: data.keywords || ''
        // });
      }
      this.loading = false;
    });
  }

  onSave(): void {
    // We no longer block on invalid form since fields are optional
    const formValue = this.metaForm.value;

    // Filter out completely empty updates if the user hasn't typed anything
    // and there was no previous data.
    if (!formValue.title && !formValue.description && !formValue.keywords) {
      this.toastr.warning('Please fill at least one field!', 'Warning');
      return;
    }

    const confirmed = confirm(`Are you sure you want to save metadata for "${this.selectedPageLabel}" page?`);
    if (!confirmed) return;

    this.saving = true;

    // Only send fields that actually have a value, so we don't overwrite
    // existing fields with empty strings if the user left them blank.
    const updateData: any = {
      lastUpdatedBy: this.authService.getUserDisplayName(),
      lastUpdatedAt: new Date()
    };
    if (formValue.title) updateData.title = formValue.title;
    if (formValue.description) updateData.description = formValue.description;
    if (formValue.keywords) updateData.keywords = formValue.keywords;

    // ✅ Track updated fields
    this.recentlyUpdatedFields = Object.keys(updateData);

    this.metadataService.updatePageMeta(this.selectedPage, updateData)
      .then(() => {
        this.toastr.success('Metadata saved successfully!', 'Success');
        // Update local savedData state with merged data
        this.savedData = { ...this.savedData, ...updateData, slug: this.selectedPage };

        // ✅ Clear form after save
        this.metaForm.reset();

        this.saving = false;
      })
      .catch(err => {
        this.toastr.error(err.message, 'Error');
        this.saving = false;
      });
  }

  logout(): void {
    this.authService.logout();
  }
}