import { Component, OnInit } from '@angular/core';
import {NavmenuService} from "./navmenu.service";
import {HttpClient} from "@angular/common/http";
import {navItems} from "./navItems";

@Component({
  selector: 'app-navmenu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.css']
})
export class NavmenuComponent implements OnInit {

  parents = new navItems().getParents();

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
      this.parents.find(x => x.name == staticNavItems[i].parent).child.push(staticNavItems[i]);
    }
  }

}
