import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminFeatureService, RoadmapFeature } from '../services/admin-feature.service';
import { AdminAuthService } from '../services/admin-auth.service';
import { ToastrService } from 'ngx-toastr';

export interface LayoutOption {
  key: string;
  label: string;
  description: string;
  imagesRequired: number; // Used for grouping in UI
}

export const LAYOUT_POSITIONS: LayoutOption[] = [
  { key: 'single',        label: 'Single Phone',     description: '1 Image: Main phone screen only',             imagesRequired: 1 },
  { key: 'duo-right',     label: 'Right Float',      description: '2 Images: Main + snippet floating right',     imagesRequired: 2 },
  { key: 'duo-left',      label: 'Left Float',       description: '2 Images: Main + snippet floating left',      imagesRequired: 2 },
  { key: 'hero-row',      label: 'Bottom Wide',      description: '2 Images: Main + wide snippet at bottom',     imagesRequired: 2 },
  { key: 'two-phones',    label: 'Two Phones',       description: '2 Images: Two full vertical phones side-by-side', imagesRequired: 2 },
  { key: 'cascade-right', label: 'Right Stack',      description: '3 Images: Main + two snippets right',         imagesRequired: 3 },
  { key: 'cascade-left',  label: 'Left Stack',       description: '3 Images: Main + two snippets left',          imagesRequired: 3 },
  { key: 'tilt-stack',    label: 'Split Sides',      description: '3 Images: Main + one left + one right',       imagesRequired: 3 },
  { key: 'three-phones',  label: 'Three Phones',     description: '3 Images: Three full vertical phones cascading', imagesRequired: 3 },
  { key: 'grid',          label: 'Cluster Around',   description: '4 Images: Main + three snippets around',      imagesRequired: 4 },
  { key: 'cascade-right-4', label: 'Right Stack 3',  description: '4 Images: Main + three snippets stacked right', imagesRequired: 4 },
  { key: 'four-phones',   label: 'Four Phones',      description: '4 Images: Four full vertical phones cascading', imagesRequired: 4 },
];

@Component({
  selector: 'app-feature-management',
  templateUrl: './feature-management.component.html',
  styleUrls: ['./feature-management.component.scss']
})
export class FeatureManagementComponent implements OnInit {
  features: RoadmapFeature[] = [];
  featureForm: FormGroup;
  isEditMode = false;
  currentFeatureId: string | null = null;
  loading = true;
  showForm = false;
  layouts = LAYOUT_POSITIONS;
  selectedLayout = 'single';
  isModuleActive = true;

  imagePreviews: string[] = [];
  saving = false;

  groupedLayouts: { title: string, layouts: LayoutOption[] }[] = [];

  constructor(
    private fb: FormBuilder,
    private featureService: AdminFeatureService,
    public authService: AdminAuthService,
    private toastr: ToastrService
  ) {
    this.groupedLayouts = [
      { title: 'For 1 Image', layouts: this.layouts.filter(l => l.imagesRequired === 1) },
      { title: 'For 2 Images', layouts: this.layouts.filter(l => l.imagesRequired === 2) },
      { title: 'For 3 Images', layouts: this.layouts.filter(l => l.imagesRequired === 3) },
      { title: 'For 4 Images', layouts: this.layouts.filter(l => l.imagesRequired === 4) },
    ];
    
    this.featureForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      images: [[]], // Array of image strings
      layoutPosition: ['single'],
      order: [1, [Validators.required, Validators.min(1)]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadFeatures();
    this.loadModuleStatus();
  }

  loadFeatures(): void {
    this.loading = true;
    this.featureService.getAllFeatures().subscribe(data => {
      this.features = data;
      this.loading = false;
    });
  }

  loadModuleStatus(): void {
    this.featureService.getModuleStatus().subscribe(status => {
      this.isModuleActive = status;
    });
  }

  toggleModule(status: boolean): void {
    this.featureService.updateModuleStatus(status).then(() => {
      this.toastr.success(`Roadmap module is now ${status ? 'ENABLED' : 'DISABLED'} on the website.`);
    }).catch(err => {
      this.toastr.error('Failed to update module status.');
      console.error(err);
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) this.resetForm();
  }

  /** Handles file input — reads, compresses to base64, and adds to images array */
  onImagePicked(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;

    // Support up to 4 images
    if (this.imagePreviews.length + files.length > 4) {
      this.toastr.warning('You can only upload up to 4 images per feature');
      return;
    }

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => { 
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round(height * (MAX_WIDTH / width));
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round(width * (MAX_HEIGHT / height));
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/webp', 0.7); // Slightly more compression for multiple images
            this.imagePreviews.push(compressedBase64);
            this.featureForm.patchValue({ images: this.imagePreviews });
            this.checkLayoutValidity();
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
    this.featureForm.patchValue({ images: this.imagePreviews });
    this.checkLayoutValidity();
  }

  moveImage(index: number, direction: 'left' | 'right'): void {
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= this.imagePreviews.length) return;
    const temp = this.imagePreviews[index];
    this.imagePreviews[index] = this.imagePreviews[newIndex];
    this.imagePreviews[newIndex] = temp;
    this.featureForm.patchValue({ images: this.imagePreviews });
  }

  selectLayout(key: string): void {
    const layoutDef = this.layouts.find(l => l.key === key);
    if (this.imagePreviews.length > 0 && layoutDef && layoutDef.imagesRequired !== this.imagePreviews.length) {
      this.toastr.warning(`This layout requires ${layoutDef.imagesRequired} image(s). You currently have ${this.imagePreviews.length}.`);
      return;
    }
    this.selectedLayout = key;
    this.featureForm.patchValue({ layoutPosition: key });
  }

  checkLayoutValidity(): void {
    if (this.imagePreviews.length === 0) return;
    
    const layoutDef = this.layouts.find(l => l.key === this.selectedLayout);
    if (layoutDef && layoutDef.imagesRequired !== this.imagePreviews.length) {
      const fallback = this.layouts.find(l => l.imagesRequired === this.imagePreviews.length);
      if (fallback) {
        this.selectedLayout = fallback.key;
        this.featureForm.patchValue({ layoutPosition: fallback.key });
        this.toastr.info(`Layout automatically changed to match ${this.imagePreviews.length} image(s).`);
      }
    }
  }

  onSubmit(): void {
    if (this.featureForm.invalid) {
      this.toastr.warning('Please fill all required fields');
      return;
    }

    if (this.imagePreviews.length === 0) {
      this.toastr.warning('Please upload at least one image');
      return;
    }

    const layoutDef = this.layouts.find(l => l.key === this.selectedLayout);
    if (layoutDef && layoutDef.imagesRequired !== this.imagePreviews.length) {
      this.toastr.warning(`Your selected layout requires ${layoutDef.imagesRequired} images, but you uploaded ${this.imagePreviews.length}.`);
      return;
    }

    const currentOrder = this.featureForm.value.order;
    if (currentOrder < 1) {
      this.toastr.warning('Order number must start with 1 or higher.');
      return;
    }

    const isDuplicate = this.features.some(f => f.order === currentOrder && f.id !== this.currentFeatureId);
    if (isDuplicate) {
      this.toastr.error(`Order number ${currentOrder} is already in use by another feature. Please choose a unique number.`);
      return;
    }

    this.saving = true;
    const featureData: RoadmapFeature = {
      ...this.featureForm.value,
      lastUpdatedBy: this.authService.getUserDisplayName(),
      lastUpdatedAt: new Date()
    };

    const action = this.isEditMode && this.currentFeatureId
      ? this.featureService.updateFeature(this.currentFeatureId, featureData)
      : this.featureService.addFeature(featureData);

    action.then(
      () => {
        this.toastr.success(this.isEditMode ? 'Feature updated!' : 'Feature added!');
        this.saving = false;
        this.toggleForm();
      },
      (err) => {
        console.error('Firebase save error:', err);
        this.saving = false;
        
        if (err?.message?.includes('exceeds')) {
          this.toastr.error('Images are too large. Please use smaller files or fewer images.');
        } else {
          this.toastr.error('Something went wrong. Please try again.');
        }
      }
    );
  }

  editFeature(feature: any): void {
    this.isEditMode = true;
    this.currentFeatureId = feature.id || null;
    let images = feature.images || [];
    if (feature.image && images.length === 0) images = [feature.image];

    this.selectedLayout = feature.layoutPosition || 'single';
    this.featureForm.patchValue({ ...feature, images });
    this.imagePreviews = [...images];
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteFeature(id: string): void {
    if (confirm('Delete this feature?')) {
      this.featureService.deleteFeature(id).then(() => {
        this.toastr.success('Feature deleted.');
      });
    }
  }

  resetForm(): void {
    this.featureForm.reset({ order: 1, isActive: true, images: [], layoutPosition: 'single' });
    this.imagePreviews = [];
    this.selectedLayout = 'single';
    this.isEditMode = false;
    this.currentFeatureId = null;
  }
}
