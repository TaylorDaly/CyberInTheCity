import { Component, OnInit } from '@angular/core';
import {PersonService} from "../Services/person.service";
import {Person} from "../person/person";
import {ResearchItem} from "../research/research";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {ResearchService} from "../Services/research.service";
import {Course} from "../education/education";
import {EducationService} from "../Services/education.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  person: Person;
  error  = "";
  courses: Course[];
  personResearch: ResearchItem[];


  constructor(private personService: PersonService,
              private activeRoute: ActivatedRoute,
              public sanitizer: DomSanitizer,
              private educationService: EducationService) { }

  ngOnInit() {
    this.getAllCourses();
    this.activeRoute.params.subscribe(
      routeParams => {
        this.getPerson(routeParams.name + '@ucdenver.edu');
      });
  }

  getPerson(email) {
    this.personService.getPersonByEmail(email)
      .subscribe(
        response => {
          this.person = response;
          this.getResearch(response[0]['_id']);
          console.log(response);
          console.log(response[0]['_id']);
          // this.router.navigateByUrl('/profile');
        },
        error => this.error = error
      );
  }
  number = this.person;


  getResearch(_id) {
    this.personService.getPersonResearch(_id)
      .subscribe(
        res => {
          this.personResearch = res;
          console.log(res);
        },
        error => this.error = error
      )
  }

  getAllCourses() {
    this.educationService.getAllCourses()
      .subscribe(
        res => {
          this.courses = res;
          console.log(res);
        },
        err => {
          this.error = err['error'].message;
        }
      )
  }
}
