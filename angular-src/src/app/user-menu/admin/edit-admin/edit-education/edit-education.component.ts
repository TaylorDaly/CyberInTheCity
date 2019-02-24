import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-education',
  templateUrl: './edit-education.component.html',
  styleUrls: ['./edit-education.component.css']
})
export class EditEducationComponent implements OnInit {

  courseList = [];
  courseFields = ['name', 'email', 'role', 'verified'];

  loadTable = false;
  errMsg = "";

  constructor() { }

  ngOnInit() {
  }

}
