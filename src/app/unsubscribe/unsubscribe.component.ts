import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.css']
})
export class UnsubscribeComponent implements OnInit {
  email: string | null = null;
  unsubscribeForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private dataService: ApiService,
    private router: Router
  ) { 
    this.unsubscribeForm = this.formBuilder.group({
      reason: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email');
  }

  get f() { return this.unsubscribeForm.controls; }

  unsubscribe(): void {

    this.submitted = true;

    if (this.email) {
      if (this.unsubscribeForm.valid){
        const unsubscribeData = {
          method: "unsubscribe",
          email: this.email,
          reason: this.unsubscribeForm.value.reason
        };

        this.dataService.unsubscribe(unsubscribeData).subscribe({
          next: (data) => {
            if (data.status == 'success') {
              alert('You have been unsubscribed.');
              this.router.navigate(['/']);
              this.submitted = false;
            }
            else {
              alert('There was an error processing your request. Please try again later.');
            }
          },
          error: (e: any) => {
            alert('There was an error processing your request. Please try again later.');
          }

        }); 
      }
      
    }
  }
}
