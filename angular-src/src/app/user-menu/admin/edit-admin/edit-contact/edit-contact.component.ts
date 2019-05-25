import { Component, OnInit } from '@angular/core';
import {StaticPage} from "../../../../navmenu/navItems";
import {PageService} from "../../../../Services/page.service";

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css']
})
export class EditContactComponent implements OnInit {

  contactUs: StaticPage;
  errMsg = "";
  loaded = false;

  constructor(private pageService: PageService) { }

  ngOnInit() {
    this.getContactPage();
  }

  getContactPage() {
    this.pageService.getStaticPageByTitle("Contact Us")
      .subscribe(
        res => {
          this.contactUs = res;
          this.loaded = true;
        },
        err => {
          this.errMsg = err.message;
        }
      )
  }

  savePage(html) {
    this.contactUs.content = html.contnet;
    this.contactUs.htmlString = html.htmlString;
    this.pageService.updatePage(this.contactUs)
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
