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

  constructor(private newsService: NewsService) { }

  ngOnInit() {
    this.getKeywords();
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
}
