import { Component, OnInit } from '@angular/core';
import {EducationService} from "../Services/education.service";
import {Course} from "./education";

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent implements OnInit {

  courses: Course[];
  error = "";

  constructor(private educationService: EducationService) { }

  ngOnInit() {
    this.getAllCourses();
  }

  getAllCourses() {
    this.educationService.getAllCourses()
      .subscribe(
        res => {
          this.courses = res;
          //console.log(res);
        },
        err => {
          this.error = err['error'].message;
        }
      )
  }
}
