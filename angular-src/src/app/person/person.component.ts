import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {PersonService} from "../Services/person.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

  personList = [];
  person = [];
  //personResearch = [];
  error = '';
  // displayAll: boolean = true;
  // displayPerson: boolean = false;

  constructor(private http: HttpClient,
              private personService: PersonService,) { }

  ngOnInit() {
    this.getAllPeople();
  }

  getAllPeople() {
    this.personService.getVerifiedPeople()
      .subscribe(
        response => {
          this.personList = response;
          //console.log(response)
        },
        error => this.error = error
      );
  }

  // getPerson(_id) {
  //   // this.displayAll = false;
  //   // this.displayPerson = true;
  //   this.personService.getPerson(_id)
  //     .subscribe(
  //       response => {
  //         this.person = response;
  //         // console.log(response)
  //         // this.router.navigateByUrl('/profile');
  //       },
  //       error => this.error = error
  //     );
  //   this.personService.getPersonResearch(_id)
  //     .subscribe(
  //       res => {
  //         this.personResearch = res;
  //         console.log(res);
  //       },
  //       error => this.error = error
  //     )
  // }

}
