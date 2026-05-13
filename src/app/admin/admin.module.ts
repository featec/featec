import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MetadataManagementComponent } from './metadata-management/metadata-management.component';
import { BlogListComponent } from './blog-management/blog-list/blog-list.component';
import { BlogFormComponent } from './blog-management/blog-form/blog-form.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { FeatureManagementComponent } from './feature-management/feature-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    MetadataManagementComponent,
    BlogListComponent,
    BlogFormComponent,
    CategoryManagementComponent,
    FeatureManagementComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    QuillModule.forRoot()
  ]
})
export class AdminModule { }