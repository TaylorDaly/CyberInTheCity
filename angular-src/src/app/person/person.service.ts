import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {Observable, throwError} from "rxjs";
import {Person} from "./person";
import 'rxjs/add/operator/catch';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private httpClient: HttpClient) { }

  getPerson() : Observable<Person[]> {
    return this.httpClient.get<Person[]>(environment.apiUrl + '/person')
      .catch(this.errorHandler);
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || "Server Error");
  }
}

