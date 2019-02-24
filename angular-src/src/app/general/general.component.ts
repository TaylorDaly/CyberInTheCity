import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {NavmenuService} from "../navmenu/navmenu.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

  content: SafeHtml;

  constructor(private activeRoute: ActivatedRoute,
              private navmenuService: NavmenuService,
              private location: Location,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(
      routeParams => {
        this.getPageTitle(routeParams.title);
      });
  }

  getPageTitle(title: string) {
    this.navmenuService.getStaticPage(title)
      .subscribe(
        response => this.content = this.sanitizer.bypassSecurityTrustHtml(response['content']),
        error => this.content = error
      );
  }
}
