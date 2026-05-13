// src/app/admin/blog-management/blog-form/blog-form.component.ts
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminBlogService } from '../../services/admin-blog.service';
import { AdminAuthService } from '../../services/admin-auth.service';
import { AdminThemeService } from '../../services/admin-theme.service';
import { ToastrService } from 'ngx-toastr';
import { QuillEditorComponent } from 'ngx-quill';
import { AdminCategoryService } from '../../services/admin-category.service';
import { Category } from '../../models/category.model';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'app-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.scss']
})
export class BlogFormComponent implements OnInit, OnDestroy {

  @ViewChild('quillEditor') quillEditorRef: QuillEditorComponent;

  blogForm: FormGroup;
  isEditMode = false;

  // FIX #6: Corrected type from `string` to `string | null` to match the null initializer.
  blogId: string | null = null;

  saving = false;
  loading = false;
  imagePreview: string | null = null;
  imageUploading = false;

  categories: Category[] = [];
  showAddCategory = false;
  newCategoryName = '';
  addingCategory = false;



  // Stores the content to inject into Quill after the editor is ready.
  private pendingContent: string = null;

  // FIX #7: Subject used to automatically unsubscribe all RxJS subscriptions on destroy.
  private destroy$ = new Subject<void>();

  // Quill modules are now defined in HTML for more reliable tooltips
  private quillInstance: any = null;

  constructor(
    private fb: FormBuilder,
    private blogService: AdminBlogService,
    public authService: AdminAuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private themeService: AdminThemeService,
    private categoryService: AdminCategoryService,
  ) { }

  ngOnInit(): void {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      excerpt: ['', Validators.required],
      content: ['', Validators.required],
      featuredImage: ['', Validators.required],
      category: ['', Validators.required],
      tags: [''],
      author: [this.authService.getUserDisplayName()],
      status: ['draft', Validators.required],
      scheduledDate: [null],
      metaTitle: [''],
      metaDescription: [''],
      metaKeywords: [''],
      readingTime: [null, [Validators.min(1)]]
    });

    this.blogId = this.route.snapshot.paramMap.get('id');

    if (this.blogId) {
      this.isEditMode = true;
      this.loading = true;

      // FIX #7: Pipe through takeUntil so this subscription is auto-cleaned on destroy.
      this.blogService.getBlog(this.blogId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(blog => {
          if (blog) {
            // Fill all fields except content (Quill needs special handling)
            this.blogForm.patchValue({
              title: blog.title || '',
              slug: blog.slug || '',
              excerpt: blog.excerpt || '',
              category: blog.category || '',
              tags: blog.tags ? blog.tags.join(', ') : '',
              author: blog.author || '',
              status: blog.status || 'draft',
              scheduledDate: blog.scheduledDate || null,
              metaTitle: blog.metaTitle || '',
              metaDescription: blog.metaDescription || '',
              metaKeywords: blog.metaKeywords || '',
              readingTime: blog.readingTime || null
            });

            if (blog.featuredImage) {
              this.imagePreview = blog.featuredImage;
              this.blogForm.patchValue({ featuredImage: blog.featuredImage });
            }

            // Store content for Quill — will be injected when editor fires onEditorCreated.
            this.pendingContent = blog.content || '';
          }
          this.loading = false;
        });
    }

    // FIX #4: Guard against null/undefined title before calling string methods.
    // FIX #7: Pipe through takeUntil so this subscription is auto-cleaned on destroy.
    this.blogForm.get('title').valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(title => {
        if (!this.isEditMode && title) {
          const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
          this.blogForm.get('slug').setValue(slug, { emitEvent: false });
        }
      });

    // Handle conditional validation for scheduledDate
    this.blogForm.get('status').valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        const scheduledDateControl = this.blogForm.get('scheduledDate');
        if (status === 'scheduled') {
          scheduledDateControl.setValidators([Validators.required]);
        } else {
          scheduledDateControl.clearValidators();
        }
        scheduledDateControl.updateValueAndValidity();
      });

    this.loadCategories();
  }

  // FIX #7: Emit on destroy$ to unsubscribe all takeUntil-piped subscriptions.
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Called by Quill when the editor DOM is fully mounted.
  onEditorCreated(quillInstance: any): void {
    this.quillInstance = quillInstance;

    // AUTOMATIC CLEAN PASTE: 
    // This strips background-color and custom text colors from pasted content 
    // while keeping bold, italic, and links intact.
    quillInstance.clipboard.addMatcher(Node.ELEMENT_NODE, (node: any, delta: any) => {
      delta.forEach((op: any) => {
        if (op.attributes) {
          // Remove background and color styles from pasted text
          delete op.attributes.background;
          delete op.attributes.color;
        }
      });
      return delta;
    });

    if (this.pendingContent) {
      const html = this.pendingContent;
      this.pendingContent = null;
      setTimeout(() => {
        quillInstance.root.innerHTML = html;
        // Sync the value back to the form control.
        this.blogForm.get('content').setValue(html, { emitEvent: false });
      }, 50);
    }
  }
  // ADD this new method
  focusEditor(): void {
    if (this.quillInstance) {
      this.quillInstance.focus();
    }
  }

  // Helper to prevent negative numbers, 'e', and decimals in numeric inputs
  onNumberKeyDown(event: KeyboardEvent): void {
    const forbiddenKeys = ['-', '+', 'e', 'E'];
    if (forbiddenKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  onImagePicked(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.toastr.error('Please select a valid image file', 'Error');
      return;
    }

    this.imageUploading = true;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress image to Base64 (0.7 quality)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          this.blogForm.patchValue({ featuredImage: compressedBase64 });
          this.imagePreview = compressedBase64;
        }

        this.imageUploading = false;
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  removeImage(event: Event): void {
    event.stopPropagation(); // Prevent triggering the file input click
    this.imagePreview = null;
    this.blogForm.patchValue({ featuredImage: '' });
  }

  async onSave(): Promise<void> {
    if (this.blogForm.invalid) {
      this.markFormGroupTouched(this.blogForm);
      const invalidFields = this.getInvalidFields();
      this.toastr.error(`Missing fields: ${invalidFields.join(', ')}`, 'Validation Error');
      return;
    }

    this.saving = true;

    // Check Slug Uniqueness
    const slug = this.blogForm.get('slug').value;
    const isUnique = await this.blogService.checkSlugUnique(slug, this.blogId);

    if (!isUnique) {
      this.toastr.error('This URL slug is already in use by another blog!', 'Duplicate URL');
      this.saving = false;
      return;
    }

    const formValue = this.blogForm.value;
    const blogData = {
      ...formValue,
      lastUpdatedBy: this.authService.getUserDisplayName(),
      lastUpdatedAt: new Date(),
      tags: formValue.tags
        ? formValue.tags.split(',').map((t: string) => t.trim())
        : [],
      scheduledDate: formValue.status === 'scheduled' ? formValue.scheduledDate : null
    };

    if (this.isEditMode) {
      this.blogService.updateBlog(this.blogId, blogData)
        .then(() => {
          this.toastr.success('Blog updated!', 'Success');
          this.router.navigate(['/admin/blogs']);
        })
        .catch(err => {
          this.toastr.error(err.message, 'Error');
        })
        // FIX #5: Always reset `saving` in finally so the button never stays
        // permanently disabled if navigation fails or an error is thrown.
        .finally(() => {
          this.saving = false;
        });
    } else {
      this.blogService.createBlog(blogData)
        .then(() => {
          this.toastr.success('Blog created!', 'Success');
          this.router.navigate(['/admin/blogs']);
        })
        .catch(err => {
          this.toastr.error(err.message, 'Error');
        })
        // FIX #5: Same finally guard for the create path.
        .finally(() => {
          this.saving = false;
        });
    }
  }

  loadCategories(): void {
    this.categoryService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(categories => {
        this.categories = categories;
      });
  }

  toggleAddCategory(): void {
    this.showAddCategory = !this.showAddCategory;
    if (!this.showAddCategory) {
      this.newCategoryName = '';
    }
  }

  async addNewCategory(): Promise<void> {
    const name = this.newCategoryName.trim();
    if (!name) {
      this.toastr.warning('Please enter a category name');
      return;
    }

    this.addingCategory = true;

    try {
      // 1. Fetch fresh categories list from Firebase to be 100% sure
      const categories$ = this.categoryService.getCategories().pipe(take(1));
      const snapshot = await categories$.toPromise() as any[];

      // 2. Check for duplicate
      if (snapshot && Array.isArray(snapshot)) {
        const exists = snapshot.some(c =>
          c.name.toLowerCase() === name.toLowerCase()
        );

        if (exists) {
          this.toastr.error('This category already exists!', 'Duplicate Error');
          this.addingCategory = false;
          return;
        }
      }

      // 3. Create the category
      await this.categoryService.createCategory(name);

      this.toastr.success('Category added!');
      this.newCategoryName = '';
      this.showAddCategory = false;

      // Auto-select the newly added category
      this.blogForm.patchValue({ category: name });
    } catch (err: any) {
      this.toastr.error('Error adding category: ' + err.message);
    } finally {
      this.addingCategory = false;
    }
  }



  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  private getInvalidFields(): string[] {
    const invalid = [];
    const controls = this.blogForm.controls;
    const labels: { [key: string]: string } = {
      title: 'Insight Title',
      excerpt: 'Brief Excerpt',
      content: 'Full Narrative',
      slug: 'Slug',
      category: 'Category',
      readingTime: 'Reading Time',
      featuredImage: 'Featured Image',
      status: 'Status'
    };

    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(labels[name] || name);
      }
    }
    return invalid;
  }
}