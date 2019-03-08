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

  addResearch(research): Observable<any> {
    return this.httpClient.post<any>(environment.apiUrl + '/research', research);
  }

  updateResearch(research): Observable<any> {
    return this.httpClient.put<any>(environment.apiUrl + '/research', research);
  }

  deleteResearch(_id): Observable<any> {
    return this.httpClient.delete<any>(environment.apiUrl + `/research/${_id}`);
  }
}
