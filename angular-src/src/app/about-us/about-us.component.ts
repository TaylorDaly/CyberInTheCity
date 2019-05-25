import { Component, OnInit } from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {PageService} from "../Services/page.service";

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  content: SafeHtml;
  errMsg = "";

  constructor(private pageService: PageService,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getAboutPage();
  }

  getAboutPage() {
    //console.log(title);
    this.pageService.getStaticPageByTitle("About Us")
      .subscribe(
        response => {
          //console.log(response);
          if(response['htmlString'] && response['htmlString'].length > 0)
            this.content = this.sanitizer.bypassSecurityTrustHtml(response['htmlString']);
          else this.content = this.sanitizer.bypassSecurityTrustHtml(response['content']);
        },
        error => {this.errMsg = error.message}
      );
  }
}
