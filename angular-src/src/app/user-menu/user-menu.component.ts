import { Component, OnInit } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {navItems} from "../navmenu/navItems";
import {UserMenuService} from "./user-menu.service";

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent implements OnInit {

  parents = new navItems().getParents();

  createPage = this.fb.group({
    htmlString: [''],
    title: [''],
    parent: ['']
  });

  constructor(private fb: FormBuilder,
              private userService: UserMenuService) { }

  ngOnInit() {
  }

  saveHtmlString(html){
    this.createPage.patchValue({
      htmlString: html
    });
  }

  addStaticPage() {
    this.userService.addPage(this.createPage)
      .subscribe(
        res => window.alert("Successfully added page to database."),
        err => {
          window.alert(err.message);
          console.log(err)
        }
      );
  }
}
