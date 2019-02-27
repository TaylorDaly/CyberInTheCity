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
          //this.newsItem = res;
          if (res.length < 10) {
          this.ranOutOfNews = true;
          console.log(`ran out of news`);
            for (let news of res){
              this.newsItem.push(news)
            }
            // If response has fewer than 10 items we have run out of news. Need to remove 'more' button
          } else {

            for (let news of res){
              this.newsItem.push(news)
            }
            // When more is clicked, set the new createdOnBefore to be the createdOn date of the last news item.
            this.createdOnBefore = new Date(this.newsItem[9].createdOn)
          }
        },
        err => {
          this.error = err['error'].message;
        }
      )
  }
}
