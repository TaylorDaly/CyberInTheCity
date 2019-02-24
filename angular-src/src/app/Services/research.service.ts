import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {ResearchItem} from "../research/research";

@Injectable({
  providedIn: 'root'
})
export class ResearchService {

  constructor(private httpClient: HttpClient) { }

  getAllResearch(): Observable<ResearchItem[]>{
    return this.httpClient.get<ResearchItem[]>(environment.apiUrl + '/research');
  }
}
