import { Component, OnInit } from '@angular/core';
import {NavmenuService} from "./navmenu.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-navmenu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.css']
})
export class NavmenuComponent implements OnInit {

  error = '';
  navItems = [
    {
      name: 'About Us',
      route: '/about-us',
      child: []
    },
    {
      name: 'People',
      route: '/person',
      child: []
    },
    {
      name: 'Research',
      route: '/research',
      child: []
    },
    {
      name: 'Education',
      route: '/education',
      child: []
    },
    {
      name: 'Careers',
      route: '/careers',
      child: []
    },
    {
      name: 'Events',
      route: '/events',
      child: []
    },
    {
      name: 'News',
      route: '/news',
      child: []
    },
    {
      name: 'Contact Us',
      route: '/contact-us',
      child: []
    },
  ];

  constructor(private http: HttpClient,
              private navmenuService: NavmenuService) { }

  ngOnInit() {
    this.getStaticPages();
  }

  getStaticPages() {
    this.navmenuService.getAllStaticPages()
      .subscribe(
        response => {
          this.sortNavItems(response)
        },
        error => this.error = error
      );
  }

  sortNavItems(staticNavItems) {
    for(let i = 0; i < staticNavItems.length; ++i) {
      this.navItems.find(x => x.name == staticNavItems[i].parent).child.push(staticNavItems[i]);
    }
  }

}
