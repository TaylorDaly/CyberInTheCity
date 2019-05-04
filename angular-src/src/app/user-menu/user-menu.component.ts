import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})

export class UserMenuComponent implements OnInit {

  admin: boolean;
  sys_admin: boolean;

  constructor() {
  }

  ngOnInit() {
    this.admin = sessionStorage.getItem('sys_role') === 'Sys_Admin' || sessionStorage.getItem('sys_role') === 'Admin';
    this.sys_admin = sessionStorage.getItem('sys_role') === 'Sys_Admin';
  }
}
