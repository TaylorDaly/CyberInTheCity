import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Person} from "../person/person";

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private httpClient: HttpClient,) { }

  canSignUp(signupToken: string): Observable<any> {
    return this.httpClient.post(environment.apiUrl + '/user/verify',
      {token: signupToken});
  }

  sendSignupEmail(signupEmail: string): Observable<any> {
    return this.httpClient.post(environment.apiUrl + "/user/signup",
      {email: signupEmail});
  }

  postNewUser(signupToken, newUser): Observable<any> {
    return this.httpClient.post(environment.apiUrl + `/user/signup/${signupToken}`,
      newUser);
  }
}
