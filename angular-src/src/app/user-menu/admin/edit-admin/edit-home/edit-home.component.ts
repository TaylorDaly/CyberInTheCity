import { Component, OnInit } from '@angular/core';
import {StaticPage} from "../../../../navmenu/navItems";
import {PageService} from "../../../../Services/page.service";

@Component({
  selector: 'app-edit-home',
  templateUrl: './edit-home.component.html',
  styleUrls: ['./edit-home.component.css']
})
export class EditHomeComponent implements OnInit {

  homePage: StaticPage;
  errMsg = "";
  loaded = false;

  constructor(private pageService: PageService) { }

  ngOnInit() {
    this.getHomePage();
  }

  getHomePage() {
    this.pageService.getStaticPageByTitle("Home")
      .subscribe(
        res => {
          this.homePage = res;
          this.loaded = true;
        },
        err => {
          this.errMsg = err.message;
        }
      )
  }

  savePage(html) {
    this.homePage.content = html;
    this.pageService.updatePage(this.homePage)
      .subscribe(
        res => {
          this.errMsg = "";
          window.alert(res['message']);
          //this.getAboutPage();
        },
        err => {
          this.errMsg = err.message;
        }
      )
  }
}
