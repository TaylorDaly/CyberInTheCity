import {Component, OnInit} from '@angular/core';
import {PageService} from "../Services/page.service";
import {HttpClient} from "@angular/common/http";
import {navItems} from "./navItems";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-navmenu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.css']
})
export class NavmenuComponent implements OnInit {

  loggedIn: boolean;

  parents = new navItems().getParents();

  constructor(private http: HttpClient,
              private pageService: PageService,
              private router: Router) {
  }

  ngOnInit() {
    this.getStaticPages();
    this.loggedIn = localStorage.getItem('jwtToken') !== null;
    this.detectLogin();
  }

  getStaticPages() {
    this.pageService.getAllStaticPages()
      .subscribe(
        response => {
          this.sortNavItems(response);
        },
      );
  }

  sortNavItems(staticNavItems) {
    for (let i = 0; i < staticNavItems.length; ++i) {
      staticNavItems[i].route = '/general/' + staticNavItems[i].title;
      this.parents.find(x => x.name == staticNavItems[i].parent).child.push(staticNavItems[i]);
    }
  }

  // Delete token to log out
  logout() {
    localStorage.clear();
    this.loggedIn = false;
    this.router.navigateByUrl('/Home');
  }

  detectLogin() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd && val.url === '/user-menu') {
        this.loggedIn = true;
      }
    });
  }
}
