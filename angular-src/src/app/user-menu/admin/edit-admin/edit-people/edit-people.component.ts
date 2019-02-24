import { Component, OnInit } from '@angular/core';
import {PersonService} from "../../../../Services/person.service";

@Component({
  selector: 'app-edit-people',
  templateUrl: './edit-people.component.html',
  styleUrls: ['./edit-people.component.css']
})
export class EditPeopleComponent implements OnInit {

  personList = [];
  personFields = ['name', 'email', 'role', 'verified'];

  loadTable = false;
  errMsg = "";

  constructor(private personService: PersonService) { }

  ngOnInit() {
    this.getAllPeople();
  }

  getAllPeople() {
    this.personService.getAllPeople()
      .subscribe(
        res => {this.setPersonList(res)},
        err => {
          //window.alert(`Error ${err.code}: ${err.message}`);
          this.errMsg = err.message;
          console.log(err);
        }
      )
  }

  setPersonList(data) {
    //console.log(data);
    for(let i = 0; i < data.length; ++i) {
      this.personList.push({_id: data[i]._id, name: data[i].name, email: data[i].email,
        role: data[i].sys_role, verified: data[i].verified.toString().charAt(0).toUpperCase()});
    }
    //console.log(this.pageList);
    this.loadTable = true;
  }
}
