import { Component, OnInit } from '@angular/core';
import {EducationService} from "../Services/education.service";
import {ActivatedRoute} from "@angular/router";
import {Course} from "../education/education";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  course: Course;
  showCourse = false;
  errMsg = "";

  constructor(private eduService: EducationService,
              private activeRoute: ActivatedRoute,
              private sanitizer: DomSanitizer,) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(
      routeParams => {
        //console.log(routeParams.courseInfo);
        this.getCourse(routeParams.courseInfo);
      });
  }

  getCourse(course) {
    this.eduService.getCourse(course)
      .subscribe(
        res => {
          this.course = res;
          this.showCourse = true;
          //console.log(this.course['googleDriveLink']);
        },
        err => {
          this.errMsg = err.message;
        }
      )
  }

}
