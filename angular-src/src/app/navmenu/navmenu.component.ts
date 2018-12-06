import { Component, OnInit } from '@angular/core';
import {NavmenuService} from "./navmenu.service";
import {NavItem, StaticNavItem} from "./navItem";

@Component({
  selector: 'app-navmenu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.css']
})
export class NavmenuComponent implements OnInit {

  staticNavItems = [];
  navItems = [
    {
      name: 'Education',
      child: []
    },
    {
      name: 'People',
      child: []
    },
    {
      name: 'Research',
      child: []
    },
    {
      name: 'General',
      child: []
    },
  ];

  constructor(private navmenuService: NavmenuService) { }

  ngOnInit() {
    this.sortNavItems();
  }

  sortNavItems() {
    this.navmenuService.getNavItems()
      .subscribe(data => {
        this.staticNavItems = data;
        console.log(data);
      });

    for(let i = 0; i < this.staticNavItems.length; ++i) {
      switch(this.staticNavItems[i].parent){
        case "Education":
          this.navItems.find(x => x.name == "Education").child.push(this.staticNavItems[i]);
          break;
        case "People":
          this.navItems.find(x => x.name == "People").child.push(this.staticNavItems[i]);
          break;
        case "Research":
          this.navItems.find(x => x.name == "Research").child.push(this.staticNavItems[i]);
          break;
        default:
          this.navItems.find(x => x.name == "General").child.push(this.staticNavItems[i]);
          break;
      }
    }
  }

}
