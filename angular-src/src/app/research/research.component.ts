import { Component, OnInit } from '@angular/core';
import {ResearchService} from "../Services/research.service";
import {ResearchItem} from "./research";

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.css']
})
export class ResearchComponent implements OnInit {


  research: ResearchItem[];
  error = "";

  constructor(private researchService: ResearchService) { }

  ngOnInit() {
    this.getAllResearch();
  }

  getAllResearch() {
    this.researchService.getAllResearch()
      .subscribe(
        res => {
          this.research = res;
        },
        err => {
          this.error = err["error"].message;
        }
      )
  }

}
