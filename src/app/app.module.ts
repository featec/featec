import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { NgwWowModule } from 'ngx-wow';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { AppHeaderComponent } from './app.header.component';
import { AppFooterComponent } from './app.footer.component';
import { SFAComponent } from './sfa/sfa.component';
import { DmsComponent } from './dms/dms.component';
import { EretailComponent } from './eretail/eretail.component';
import { ProjectManagementComponent } from './project-management/project-management.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { RecaptchaV3Module,RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { ToastrModule } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { DatabaseServiceComponent } from './database-service/database-service.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SocialMediaComponent } from './social-media/social-media.component';
import { UnsubscribeComponent } from './unsubscribe/unsubscribe.component';
import { DemoRequestComponent } from './demo-request/demo-request.component';
import { FeatureRoadmapComponent } from './feature-roadmap/feature-roadmap.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

// import {NgxTypedJsModule} from '../assets/js/ngx-typed-js/src/lib/ngx-typed-js.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ServiceComponent,
    PortfolioComponent,
    BlogComponent,
    ErrorComponent,
    ContactComponent,
    BlogDetailComponent,
    LoginComponent,
    RegisterComponent,
    AppHeaderComponent,
    AppFooterComponent,
    DatabaseServiceComponent,
    SocialMediaComponent,
    UnsubscribeComponent,
    DemoRequestComponent,
    FeatureRoadmapComponent,
    SFAComponent,
    DmsComponent,
    EretailComponent,
    ProjectManagementComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    NgwWowModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RecaptchaV3Module,
    NgbModule,
    ToastrModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    // RecaptchaModule,
    // RecaptchaFormsModule,
   // NgxTypedJsModule
  ],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }, {
    provide: RECAPTCHA_V3_SITE_KEY,
    useValue: environment.recaptcha.siteKey,
  }],
  bootstrap: [AppComponent, AppHeaderComponent, AppFooterComponent]
})
export class AppModule {
}
