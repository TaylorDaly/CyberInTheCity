import {Component, OnInit} from '@angular/core';
import {ResearchItem} from "../research/research";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {ResearchService} from "../Services/research.service";
import {PersonService} from "../Services/person.service";
import {Person} from "../person/person";

@Component({
  selector: 'app-research-info',
  templateUrl: './research-info.component.html',
  styleUrls: ['./research-info.component.css']
})
export class ResearchInfoComponent implements OnInit {

  research: ResearchItem;
  showResearch = false;
  personList: Person[];
  errMsg = "";

  constructor(private sanitizer: DomSanitizer,
              private activeRoute: ActivatedRoute,
              private researchService: ResearchService,
              private personService: PersonService) {
  }

  ngOnInit() {
    this.getAllPeople();
  }

  getAllPeople() {
    this.personService.getVerifiedPeople()
      .subscribe(
        res => {
          this.personList = res;
          this.activeRoute.params.subscribe(
            routeParams => {
              //console.log(routeParams.courseInfo);
              this.getAllResearch(routeParams.title);
            });
        },
        err => {
          this.errMsg = err.message;
        }
      )
  }

  getAllResearch(title) {
    this.researchService.getAllResearch()
      .subscribe(
        res => {
          this.getResearchByTitle(res, title);
          this.showResearch = true;
          //console.log(this.course['googleDriveLink']);
        },
        err => {
          this.errMsg = err.message;
        }
      )
  }

  getResearchByTitle(res, title) {

    // Find research with the correct title //
    for (let i = 0; i < res.length; ++i) {
      if (res[i].title === title) {
        this.research = res[i];
        break;
      }
    }

    this.research.researcherEmails = [];
    // Get all researchers for this research //
    for (let i = 0; i < this.research.ownerID.length; ++i) {
      let researcher = this.personList.find(x => x._id == this.research.ownerID[i]);
      this.research.ownerID[i] =  researcher.name;
      this.research.researcherEmails.push(researcher.email);
    }
    this.research.researchers = this.research.ownerID.join(', ');  // List all researchers in one string //

    // If research type is empty //
    if (this.research.type == "") this.research.type = "Not Declared";
  }
}
