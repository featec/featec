import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ServiceComponent } from './services/service.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { BlogComponent } from './blog/blog.component';
import { ErrorComponent } from './404/404.component';
import { BlogDetailComponent } from './blog-detail/blogdetail.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ContactComponent } from './contact/contact.component';
import { SFAComponent } from './sfa/sfa.component';
import { DatabaseServiceComponent } from './database-service/database-service.component';
import { DmsComponent} from './dms/dms.component';
import { EretailComponent } from './eretail/eretail.component';
import { UnsubscribeComponent } from './unsubscribe/unsubscribe.component';
import { ProjectManagementComponent } from './project-management/project-management.component';

const routes: Routes = [
//   { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'services', component: ServiceComponent },
  { path: 'product', component: PortfolioComponent },
  { path: 'blog', component: BlogComponent },
  { path: '404', component: ErrorComponent },
  { path: 'blog-detail', component: BlogDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'field-sales-force-automation-software', component: SFAComponent },
  { path: 'distribution-management-system-software', component: DmsComponent },
  { path: 'database-service', component: DatabaseServiceComponent },
  { path: 'e-commerce-crm-software', component: EretailComponent},
  { path: 'unsubscribe', component: UnsubscribeComponent },
  { path: 'project-management', component: ProjectManagementComponent },
  
  {
    path: 'database-service',
    loadChildren: () => import('./database-service/database-service.module').then(m => m.DatabaseServiceModule),
   
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  { path: 'blog/:slug', component: BlogDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', initialNavigation: 'enabledBlocking' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
