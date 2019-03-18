import { Component, OnInit } from '@angular/core';
import {PersonService} from "../Services/person.service";
import {Person} from "../person/person";
import {ResearchItem} from "../research/research";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  person: Person;
  error  = "";
  personResearch: ResearchItem[];

  constructor(private personService: PersonService,
              private activeRoute: ActivatedRoute,
              public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(
      routeParams => {
        this.getPerson(routeParams.name + '@ucdenver.edu');
      });
  }

  getPerson(email) {
    // this.displayAll = false;
    // this.displayPerson = true;
    this.personService.getPersonByEmail(email)
      .subscribe(
        response => {
          this.person = response;
          this.getResearch(response['_id']);
          // console.log(response)
          // this.router.navigateByUrl('/profile');
        },
        error => this.error = error
      );
  }

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
}
