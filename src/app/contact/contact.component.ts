import { Component , OnInit } from '@angular/core';
import * as $ from 'jquery';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { ToastrService } from 'ngx-toastr';
import { Meta, Title } from '@angular/platform-browser';
import { MetadataService } from '../services/metadata.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
})
export class ContactComponent implements OnInit {

  token: string | undefined;
  registerForm: FormGroup;
  reCAPTCHAToken: string;
  tokenVisible: boolean = false;
  submitted = false;
  loading = false;
  pageTitle = "Contact Featec Business Solutions";

  constructor(private fb: FormBuilder, private dataService: ApiService, private router: Router, private recaptchaV3Service: ReCaptchaV3Service,
    private toastr: ToastrService, private meta: Meta, private title: Title, private metadataService: MetadataService) {

  }
  ngOnInit() {
    this.title.setTitle(this.pageTitle);
    this.meta.updateTag(
      { name: 'description', content: 'Contact Featec Business Solutions for support and inquiries. Reach us by phone, email, through our online form, or visit our offices in Madurai and Chennai.' }
    );
    this.metadataService.loadMetadata('contact');

    this.registerForm = this.fb.group({
      method:['user_create'],
      email: ['', [Validators.required, Validators.email]],
      about: [''],
      name: ['', Validators.required],
      phone: ['', Validators.required],
      captchaToken: ['', Validators.required]
    });
  }
  
  get f() { return this.registerForm.controls; }

  onSubmit() {
    
    this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
      this.tokenVisible = true;
      this.reCAPTCHAToken = `Token [${token}] generated`;
      this.registerForm.patchValue({ captchaToken: token });

      
      this.submitted = true;
      if (this.registerForm.invalid) {
        this.hideButtonLoader();
        return;
      }else{ 

      this.dataService.userregistration(this.registerForm.value).subscribe({
        next: (data) => {
          if (data.status == 'success') {
            this.hideButtonLoader();
            this.toastr.success(data.message, 'Success', {
              timeOut: 3000,
            });

            // Reset the form after successful submission
            this.registerForm.reset();
            this.submitted = false;
          }
          else {
            this.hideButtonLoader();
            this.toastr.error(data.message, 'error', {
              timeOut: 3000,
            });
          }
        },
        error: (e: any) => {
          this.hideButtonLoader();
          // this.error = e ? e : '';
        }
      });
    }
    
  });

    
  }

  showButtonLoader() {
    this.loading = true;
  }

  hideButtonLoader() {
    this.loading = false;
  }
 }

