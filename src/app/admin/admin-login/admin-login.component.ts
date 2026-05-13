// src/app/admin/admin-login/admin-login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {

  loginForm: FormGroup;
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AdminAuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/admin/dashboard']);
    }

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;

    this.loading = true;
    const { username, password } = this.loginForm.value;

    try {
      const success = await this.authService.login(username, password);
      if (success) {
        this.toastr.success('Welcome back!', 'Login Successful');
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.toastr.error('Invalid username or password', 'Login Failed');
        this.loading = false;
      }
    } catch (err) {
      this.toastr.error('Something went wrong', 'Error');
      this.loading = false;
    }
  }
}