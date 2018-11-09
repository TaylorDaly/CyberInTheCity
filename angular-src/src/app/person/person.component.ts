import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
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
    this.personService.getPerson()
      .subscribe(data => {
        this.personList = data;
        console.log(data);
      });
  }

}
