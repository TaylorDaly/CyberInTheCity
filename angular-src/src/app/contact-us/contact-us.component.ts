import { Component, OnInit } from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {PageService} from "../Services/page.service";

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  content: SafeHtml;
  errMsg = "";

  constructor(private pageService: PageService,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getContactPage();
  }

  getContactPage() {
    //console.log(title);
    this.pageService.getStaticPageByTitle("Contact Us")
      .subscribe(
        response => {
          //console.log(response);
          this.content = this.sanitizer.bypassSecurityTrustHtml(response['content']);
        },
        error => {this.errMsg = error.message}
      );
  }
}
