import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {NewsItem} from "../news/news";

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private httpClient: HttpClient) { }

  getNews(date): Observable<NewsItem[]> {
    console.log(environment.apiUrl + '/news?createdOnBefore=' + date.toString());
    return this.httpClient.get<NewsItem[]>(environment.apiUrl + '/news?createdOnBefore=' + date.toString());
  }

  getNewsKeywords() {
    return this.httpClient.get(environment.apiUrl + '/news/getKeywords',{responseType: 'text'});
  }

  updateNewsKeywords(keywords) {
    return this.httpClient.post(environment.apiUrl + '/news', keywords);
  }
}
