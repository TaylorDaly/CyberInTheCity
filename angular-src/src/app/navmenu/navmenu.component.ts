import { Component, OnInit } from '@angular/core';
import {NavmenuService} from "./navmenu.service";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-navmenu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.css']
})
export class NavmenuComponent implements OnInit {

  error = '';
  staticNavItems = [];
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
    this.sortNavItems();
    console.log(this.navItems);
    console.log(this.staticNavItems);
  }

  sortNavItems() {
    this.navmenuService.getNavItems()
      .subscribe(
        response => {
          this.staticNavItems = response;
        },
        error => this.error = error
      );

    console.log(this.staticNavItems);

    for(let i = 0; i < this.staticNavItems.length; ++i) {
      switch(this.staticNavItems[i].parent){
        case "About Us":
          this.navItems.find(x => x.name == "About Us").child.push(this.staticNavItems[i]);
          break;
        case "People":
          this.navItems.find(x => x.name == "People").child.push(this.staticNavItems[i]);
          break;
        case "Research":
          this.navItems.find(x => x.name == "Research").child.push(this.staticNavItems[i]);
          break;
        case "Education":
          this.navItems.find(x => x.name == "Education").child.push(this.staticNavItems[i]);
          break;
        case "Careers":
          this.navItems.find(x => x.name == "Careers").child.push(this.staticNavItems[i]);
          break;
        case "Events":
          this.navItems.find(x => x.name == "Events").child.push(this.staticNavItems[i]);
          break;
        case "News":
          this.navItems.find(x => x.name == "News").child.push(this.staticNavItems[i]);
          break;
        default:
          this.navItems.find(x => x.name == "Contact Us").child.push(this.staticNavItems[i]);
          break;
      }
    }
  }

}
