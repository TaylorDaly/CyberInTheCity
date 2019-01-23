import { Component } from '@angular/core';
import {NavigationEnd, NavigationStart, Router, Event} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loading = true;

  constructor(private router: Router) {
    this.router.events.subscribe((routerEvent: Event) => {
      if(routerEvent instanceof NavigationStart) {
        this.loading = true;
      }
      if(routerEvent instanceof NavigationEnd) {
        this.loading = false;
      }
    });
  }


}
