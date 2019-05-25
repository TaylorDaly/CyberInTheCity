import { Component, OnInit } from '@angular/core';
import {StaticPage} from "../../../../navmenu/navItems";
import {PageService} from "../../../../Services/page.service";

@Component({
  selector: 'app-edit-about',
  templateUrl: './edit-about.component.html',
  styleUrls: ['./edit-about.component.css']
})
export class EditAboutComponent implements OnInit {

  aboutUs: StaticPage;
  errMsg = "";
  loaded = false;

  constructor(private pageService: PageService) { }

  ngOnInit() {
    this.getAboutPage();
  }

  getAboutPage() {
    this.pageService.getStaticPageByTitle("About Us")
      .subscribe(
        res => {
          this.aboutUs = res;
          this.loaded = true;
        },
        err => {
          this.errMsg = err.message;
        }
      )
  }

  savePage(html) {
    this.aboutUs.content = html.content;
    this.aboutUs.htmlString = html.htmlString;
    this.pageService.updatePage(this.aboutUs)
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
