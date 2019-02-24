import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {PersonService} from "../Services/person.service";

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

  personList = [];
  error = '';

  constructor(private http: HttpClient,
              private personService: PersonService) { }

  ngOnInit() {
    this.getAllPeople();
  }

  getAllPeople() {
    this.personService.getPerson()
      .subscribe(
        response => this.personList = response,
        error => this.error = error
      );
  }
}
