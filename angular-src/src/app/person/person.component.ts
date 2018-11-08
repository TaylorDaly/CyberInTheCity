import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {PersonService} from "./person.service";


@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

  personList = [];

  constructor(private http: HttpClient,
              private personService: PersonService) { }

  ngOnInit() {
    this.personList = this.personService.getPerson();
  }

}
