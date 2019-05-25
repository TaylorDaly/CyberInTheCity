import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,} from "@angular/router";
import {Location} from "@angular/common";
import {PageService} from "../Services/page.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

  content: SafeHtml;
  errMsg = "";

  constructor(private activeRoute: ActivatedRoute,
              private pageService: PageService,
              private location: Location,
              private sanitizer: DomSanitizer,) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(
      routeParams => {
        this.getPageTitle(routeParams.title);
      });
  }

  getPageTitle(title: string) {
    //console.log(title);
    this.pageService.getStaticPageByTitle(title)
      .subscribe(
        response => {
          if(response['htmlString'] && response['htmlString'].length > 0)
            this.content = this.sanitizer.bypassSecurityTrustHtml(response['htmlString']);
          else this.content = this.sanitizer.bypassSecurityTrustHtml(response['content']);
        },
        error => {this.errMsg = error.message}
      );
  }
}
