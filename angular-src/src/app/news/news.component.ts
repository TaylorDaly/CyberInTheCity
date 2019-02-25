import { Component, OnInit } from '@angular/core';
import {NewsService} from "../Services/news.service"
import {NewsItem} from "./news";

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  newsItem: NewsItem[];
  error = "";

  constructor(private newsService: NewsService) { }

  ngOnInit() {
    this.getNews();
  }

  getNews(){
    this.newsService.getNews(new Date())
      .subscribe(
        res => {
          this.newsItem = res;
        },
        err => {
          this.error = err['error'].message;
        }
      )
  }
}
