import { Component, OnInit } from '@angular/core';
import {NewsItem} from "../news/news";
import {NewsService} from "../Services/news.service";
import {EventItem} from "../events/events";
import {EventsService} from "../Services/event.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {PageService} from "../Services/page.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  newsItem: NewsItem[];
  eventItem: EventItem[];
  errMsg = "";
  createdOnBefore = new Date();
  noNews = false;
  noEvents = false;
  content: SafeHtml;

  constructor(private newsService: NewsService,
              private eventsService: EventsService,
              private pageService: PageService,
              private sanitizer: DomSanitizer) {
    this.newsItem = [];
    this.eventItem = [];
  }

  ngOnInit() {
    this.getNews();
    this.getEvents();
    this.getHomePage();
  }

  getHomePage() {
    //console.log(title);
    this.pageService.getStaticPageByTitle("Home")
      .subscribe(
        response => {
          //console.log(response);
          this.content = this.sanitizer.bypassSecurityTrustHtml(response['content']);
        },
        error => {this.errMsg = error.message}
      );
  }

  getNews() {
    this.newsService.getNews(this.createdOnBefore)
      .subscribe(
        res => {
          if (res.length == 0) this.noNews = true;
          else HomeComponent.setItems(res, this.newsItem);
        },
          err => {
            this.errMsg = err.message;
          }
      )
  }

  getEvents() {
    this.eventsService.getAllEvents()
      .subscribe(
        res => {
          if(res.length == 0) this.noEvents = true;
          else HomeComponent.setItems(res, this.eventItem);
        },
        err => {
          this.errMsg = err.message;
        }
      )
  }

  static setItems(res, item) {
    let length = 1;
    if (res.length >= 3) length = 3;  // Set Max length //
    else length = res.length;

    for (let i = 0; i < length; ++i) {
      item.push(res[i]);
    }
  }

}
