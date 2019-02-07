import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
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
    content: [''],
    title: ['', Validators.required],
    parent: ['', Validators.required]
  });

  get title() {
    return this.createPage.get('title');
  }
  get parent() {
    return this.createPage.get('parent');
  }

  constructor(private fb: FormBuilder,
              private userService: UserMenuService) { }

  ngOnInit() {
  }

  addStaticPage(html) {
    this.createPage.patchValue({
      content: html,
      // title: this.title.value.trim()
    });
    console.log(this.createPage.value);
    this.userService.addPage(this.createPage.value)
      .subscribe(
        res => window.alert("Successfully added page to database."),
      );
  }
}
