import { Component, OnInit } from '@angular/core';
import {ResearchService} from "../../../../Services/research.service";

@Component({
  selector: 'app-edit-research',
  templateUrl: './edit-research.component.html',
  styleUrls: ['./edit-research.component.css']
})
export class EditResearchComponent implements OnInit {

  researchList = [];
  researchFields = ['title', 'type', 'start_date', 'end_date'];

  loadTable = false;
  errMsg = "";

  constructor(private researchService: ResearchService) { }

  ngOnInit() {
    this.getAllResearch();
  }

  getAllResearch(){
    this.researchService.getAllResearch()
      .subscribe(
        res => {
          this.setResearch(res);
          //console.log(res);
        },
        err => {
          //window.alert(`Error ${err.code}: ${err.message}`);
          this.errMsg = err.message;
          console.log(err);
        }
      )
  }

  setResearch(data) {
    for(let i = 0; i < data.length; ++i) {
      this.researchList.push({
        _id: data[i]._id,
        title: data[i].title,
        type: data[i].type,
        start_date: new Date(data[i].startDate).toLocaleDateString(),
        end_date: new Date(data[i].endDate).toLocaleDateString()});
    }
    this.loadTable = true;
  }
}
