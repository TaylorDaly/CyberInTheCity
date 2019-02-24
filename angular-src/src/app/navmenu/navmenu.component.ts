import { Component, OnInit } from '@angular/core';
import {NavmenuService} from "./navmenu.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-navmenu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.css']
})
export class NavmenuComponent implements OnInit {

  navItems = [
    {
      name: 'About Us',
      route: '/about',
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
      child: [
        {
          route: '/research/labs',
          title: 'Research Labs'
        }
      ]
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
      route: '/contact',
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
      );
  }

  sortNavItems(staticNavItems) {
    for(let i = 0; i < staticNavItems.length; ++i) {
      staticNavItems[i].route = '/general/' + staticNavItems[i].title;
      this.navItems.find(x => x.name == staticNavItems[i].parent).child.push(staticNavItems[i]);
    }
  }

}
