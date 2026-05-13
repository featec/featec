import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MetadataManagementComponent } from './metadata-management/metadata-management.component';
import { BlogListComponent } from './blog-management/blog-list/blog-list.component';
import { BlogFormComponent } from './blog-management/blog-form/blog-form.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { FeatureManagementComponent } from './feature-management/feature-management.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';

const routes: Routes = [
  { path: 'login', component: AdminLoginComponent },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AdminAuthGuard],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'metadata', component: MetadataManagementComponent },
      { path: 'categories', component: CategoryManagementComponent },
      { path: 'blogs', component: BlogListComponent },
      { path: 'features', component: FeatureManagementComponent },
      { path: 'blogs/new', component: BlogFormComponent },
      { path: 'blogs/edit/:id', component: BlogFormComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }