import { Injectable, Output, EventEmitter } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Users } from './contact/users';

let API_URL = "https://featec.in/app/index.php";

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  redirectUrl: string;

  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();
  constructor(private httpClient: HttpClient) { }


  userregistration(data: any) {
    return this.httpClient.post<any>(API_URL, data)
      .pipe(map((response: any) => {
        return response;
      }));

  }

  unsubscribe(data: any) {
    return this.httpClient.post<any>(API_URL, data)
      .pipe(map((response: any) => {
        return response;
      }));
  }

  demoRequest(data: any) {
    return this.httpClient.post<any>(API_URL, data)
      .pipe(map((response: any) => {
        return response;
      }));
  }

}
