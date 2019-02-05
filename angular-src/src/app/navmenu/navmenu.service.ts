import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {StaticPage} from "./navItems";

@Injectable({
  providedIn: 'root'
})
export class NavmenuService {

  constructor(private httpClient: HttpClient) { }

  getAllStaticPages() : Observable<StaticPage[]> {
    return this.httpClient.get<StaticPage[]>(environment.apiUrl + '/page');
  }

  getStaticPage(title:string) : Observable<StaticPage>{
    return this.httpClient.get<StaticPage>(environment.apiUrl + '/page/' + title);
    }
}
