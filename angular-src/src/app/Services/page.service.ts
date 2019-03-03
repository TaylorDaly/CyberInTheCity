import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {StaticPage} from "../navmenu/navItems";

@Injectable({
  providedIn: 'root'
})
export class PageService {

  constructor(private httpClient: HttpClient) { }

  getAllStaticPages() : Observable<StaticPage[]> {
    return this.httpClient.get<StaticPage[]>(environment.apiUrl + '/page');
  }

  getStaticPageByTitle(title:string) : Observable<StaticPage>{
    // return this.httpClient.get<StaticPage>(environment.apiUrl + `/page/${title}`);
    return this.httpClient.get<StaticPage>(environment.apiUrl + `/page?title=${title}`);

  }

  getStaticPageById(_id:string) : Observable<StaticPage>{
    return this.httpClient.get<StaticPage>(environment.apiUrl + `/page?_id=${_id}`);
  }

  addPage(page: object): Observable<any> {
    return this.httpClient.post(environment.apiUrl + '/page', page);
  }

  updatePage(page) {
    return this.httpClient.put(environment.apiUrl + '/page', page);
  }

  // updatePage(page) {
  //   return this.httpClient.put(environment.apiUrl + '/page', page);
  // }

  deletePage(page) {
    return this.httpClient.request('delete',environment.apiUrl + '/page', {body: page});
  }

  // deletePage(id) {
  //   return this.httpClient.delete(environment.apiUrl + "/page");
  // }
}
