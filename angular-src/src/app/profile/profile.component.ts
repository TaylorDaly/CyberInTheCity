import { Component, OnInit } from '@angular/core';
import {PersonService} from "../Services/person.service";
import {Person} from "../person/person";
import {ResearchItem} from "../research/research";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {Course} from "../education/education";
import {EducationService} from "../Services/education.service";
import {ResearchService} from "../Services/research.service";

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
              private researchService: ResearchService,
              private activeRoute: ActivatedRoute,
              public sanitizer: DomSanitizer,
              private educationService: EducationService) {
    this.courses = [];
  }

  ngOnInit() {
    //this.getAllCourses();
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
          this.getAllCourses();
          this.getResearch(response[0]['_id']);
        },
        error => this.error = error.message
      );
  }

  getResearch(_id) {
    this.researchService.getPersonResearch(_id)
      .subscribe(
        res => {
          this.personResearch = res;
          //console.log(res);
        },
        error => this.error = error.message
      )
  }

  getAllCourses() {
    this.educationService.getAllCourses()
      .subscribe(
        res => {
          this.courses = res;
        },
        err => {
          this.error = err.message;
        }
      )
  }

}
