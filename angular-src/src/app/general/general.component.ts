import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {NavmenuService} from "../navmenu/navmenu.service";

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

  content = "";
  error = "";

  constructor(private route: ActivatedRoute,
              private navmenuService: NavmenuService,
              private location: Location) { }

  ngOnInit() {
    this.getPageTitle();
  }

  getPageTitle() {
    const title = this.route.snapshot.paramMap.get('title');
    this.navmenuService.getOneNavItem(title)
      .subscribe(
        response => this.content = response['content'],
        error => this.error = error
      );
  }
}
