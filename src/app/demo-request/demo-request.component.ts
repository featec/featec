import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-demo-request',
  templateUrl: './demo-request.component.html',
  styleUrls: ['./demo-request.component.css']
})
export class DemoRequestComponent implements OnInit{
  @Input() applicationId!: number;
  @Input() applicationName!: string;
  demoForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private dataService: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    console.log('Application ID:', this.applicationId);
    console.log('Application Name:', this.applicationName);
    this.demoForm = this.fb.group({
      fullName: ['', Validators.required],
      mobileNo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      purpose: [''],
      preferredDate: [''],
      duration: [''],
      preferredTime: [''],
      additionalInfo: [''],
      questions: [''],
      projectId:this.applicationId,
      method: "demo_request"
    });
  }

  get f() { return this.demoForm.controls; } 

  onSubmit() {

      this.submitted = true;
      if (this.demoForm.invalid) {
        this.hideButtonLoader();
        return;
      } else {
        this.showButtonLoader();
        this.dataService.demoRequest(this.demoForm.value).subscribe({
          next: (data) => {
            if (data.status == 'success') {
              this.hideButtonLoader();
              this.toastr.success(data.message, 'Success', {
                timeOut: 3000,
              });

              // Reset the form after successful submission
              this.demoForm.reset();
              this.activeModal.close();
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
  }

  showButtonLoader() {
    this.loading = true;
  }

  hideButtonLoader() {
    this.loading = false;
  }

  closeModal() {
    this.activeModal.close();
  }
}
