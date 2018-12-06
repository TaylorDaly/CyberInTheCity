import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {StaticNavItem} from "./navItem";

@Injectable({
  providedIn: 'root'
})
export class NavmenuService {

  constructor(private httpClient: HttpClient) { }

  getNavItems() : Observable<StaticNavItem[]> {
    return this.httpClient.get<StaticNavItem[]>(environment.apiUrl + '/page');
  }
}
