import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Person} from "./person";

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getPerson() : Observable<Person[]> {
    return this.httpClient.get<Person[]>(this.url + '/person');
  }
}

