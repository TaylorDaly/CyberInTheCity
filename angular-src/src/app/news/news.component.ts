import {Component, OnInit} from '@angular/core';
import {NewsService} from "../Services/news.service"
import {NewsItem} from "./news";
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],

})
export class NewsComponent implements OnInit {

  newsItem: NewsItem[];
  ranOutOfNews: boolean;
  error = "";
  createdOnBefore = new Date();
  throttle = 300;
  scrollDistance = 1;

  constructor(private newsService: NewsService) {
  }

  ngOnInit() {
    this.newsItem=[];
    this.ranOutOfNews = false;
    this.getNews();
  }

  onScrollDown() {
    if(!this.ranOutOfNews) this.getNews();
  }

  getNews() {
    this.newsService.getNews(this.createdOnBefore)
      .subscribe(
        res => {
          if (res.length < 10) {
          this.ranOutOfNews = true;
          console.log(`ran out of news`);
            for (let news of res){
              this.newsItem.push(news)
            }
            // If response has fewer than 10 items we have run out of news. Need to stop from appending news.
          } else {
            for (let news of res){
              this.newsItem.push(news)
            }
            // When scroll event happens, get the next 10 based on createdOn date
            this.createdOnBefore = new Date(res[9].createdOn)
          }
        },
        err => {
          this.error = err['error'].message;
        }
      )
  }
}
