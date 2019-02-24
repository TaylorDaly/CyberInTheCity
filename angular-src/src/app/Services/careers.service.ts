import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {CareersItem} from "../careers/careers";

@Injectable({
  providedIn: 'root'
})
export class CareersService {

  constructor(private httpClient: HttpClient) { }

  getAllCareers(): Observable<CareersItem[]>{
    return this.httpClient.get<CareersItem[]>(environment.apiUrl + '/careers');
  }
}
