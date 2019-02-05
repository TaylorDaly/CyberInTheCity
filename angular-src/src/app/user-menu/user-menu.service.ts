import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserMenuService {

  constructor(private httpClient: HttpClient) { }

  addPage(page: object): Observable<any> {
    return this.httpClient.post(environment.apiUrl + '/page', page);
  }
}
