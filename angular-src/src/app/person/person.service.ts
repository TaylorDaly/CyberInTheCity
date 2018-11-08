import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getPerson() {
    return this.httpClient.get(this.url);
  }
}
