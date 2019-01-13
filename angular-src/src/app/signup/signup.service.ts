import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  blah = false;

  constructor(private httpClient: HttpClient,) { }

  canSignUp(signupToken: string): Observable<any> {
    return this.httpClient.post(environment.apiUrl + '/user/verify',
      {token: signupToken});
  }

  sendSignupEmail(signupEmail: string): Observable<any> {
    return this.httpClient.post(environment.apiUrl + "/user/signup",
      {email: signupEmail});
  }
}
