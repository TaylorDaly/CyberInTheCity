import { Component, OnInit } from '@angular/core';
import {NewsService} from "../../../../Services/news.service";

@Component({
  selector: 'app-edit-news',
  templateUrl: './edit-news.component.html',
  styleUrls: ['./edit-news.component.css']
})
export class EditNewsComponent implements OnInit {

  errMsg = "";
  newsKeywords = "";
  badKeywords = "";

  constructor(private newsService: NewsService) { }

  ngOnInit() {
    this.getKeywords();
    this.getBadKeywords();
  }

  getKeywords() {
    this.newsService.getNewsKeywords()
      .subscribe(
        res =>{
          this.newsKeywords = res;
        },
        err => {this.errMsg = `Error ${err.code}: ${err.message}`}
        )
  }

  getBadKeywords() {
    this.newsService.getBadNewsKeywords()
      .subscribe(
        res =>{
          this.badKeywords = res;
        },
        err => {this.errMsg = `Error ${err.code}: ${err.message}`}
      )
  }

  updateKeywords() {
    if (window.confirm('Are you sure you want to change the news keywords?')) {
      this.newsService.updateNewsKeywords({keywords: this.newsKeywords})
        .subscribe(
          res => {
            alert(res['message']);
          },
          err => {this.errMsg = `Error ${err.code}: ${err.message}`}
        )
    }
  }

  updateBadKeywords() {
    if (window.confirm('Are you sure you want to change the bad news keywords?')) {
      this.newsService.updateBadNewsKeywords({keywords: this.badKeywords})
        .subscribe(
          res => {
            alert(res['message']);
          },
          err => {this.errMsg = `Error ${err.code}: ${err.message}`}
        )
    }
  }
}
