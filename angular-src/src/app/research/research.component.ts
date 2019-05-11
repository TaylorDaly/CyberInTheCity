import { Component, OnInit } from '@angular/core';
import {ResearchService} from "../Services/research.service";
import {ResearchItem} from "./research";
import {PersonService} from "../Services/person.service";
import {Person} from "../person/person";

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.css']
})
export class ResearchComponent implements OnInit {

  research: ResearchItem[];
  personList: Person[];
  errMsg = "";

  constructor(private researchService: ResearchService,
              private personService: PersonService) {
    this.research = [];
  }

  ngOnInit() {
    this.getAllPeople();
  }

  getAllPeople() {
    this.personService.getVerifiedPeople()
      .subscribe(
        res => {
          this.personList = res;
          this.getAllResearch();
        },
        err => {
          this.errMsg = err.message;
        }
      )
  }

  getAllResearch() {
    this.researchService.getAllResearch()
      .subscribe(
        res => {
          this.setResearch(res);
          //this.research = res;
        },
        err => {
          this.errMsg = err["error"].message;
        }
      )
  }

  setResearch(res) {
    for(let i = 0; i < res.length; ++i) {
      let temp: ResearchItem = res[i];

      // Get researchers by their name from their ID //
      for(let j = 0; j < temp.ownerID.length; ++j) {
        temp.ownerID[j] = this.personList.find(x => x._id == temp.ownerID[j]).name;
      }
      temp.researchers = temp.ownerID.join(', ');  // List all researchers in one string //

      // If research type is empty //
      if(res['type'] == "") temp.type = "Not Declared";

      this.research.push(temp);
    }
  }
}
