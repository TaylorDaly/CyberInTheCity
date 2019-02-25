import { Component, OnInit } from '@angular/core';
import {EducationService} from "../../../../Services/education.service";

@Component({
  selector: 'app-edit-education',
  templateUrl: './edit-education.component.html',
  styleUrls: ['./edit-education.component.css']
})
export class EditEducationComponent implements OnInit {

  courseList = [];
  courseFields = ['course', 'name', 'term'];

  loadTable = false;
  errMsg = "";

  constructor(private eduService: EducationService) { }

  ngOnInit() {
    this.getAllCourses();
  }

  getAllCourses(){
    this.eduService.getAllCourses()
      .subscribe(
        res => {
          this.setCourses(res);
          //console.log(res);
          },
        err => {
          //window.alert(`Error ${err.code}: ${err.message}`);
          this.errMsg = err.message;
          console.log(err);
        }
      )
  }

  setCourses(data) {
    for(let i = 0; i < data.length; ++i) {
      this.courseList.push({
        _id: data[i]._id,
        course: data[i].courseNumber,
        name: data[i].courseName,
        term: data[i].termYear});
    }
    this.loadTable = true;
  }
}
