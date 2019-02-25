import { Component, OnInit } from '@angular/core';
import {CareersService} from "../../../../Services/careers.service";

@Component({
  selector: 'app-edit-careers',
  templateUrl: './edit-careers.component.html',
  styleUrls: ['./edit-careers.component.css']
})
export class EditCareersComponent implements OnInit {

  careerList = [];
  careerFields = ['job_title', 'type', 'company', 'post_date'];

  loadTable = false;
  errMsg = "";

  constructor(private careerService: CareersService) { }

  ngOnInit() {
    this.getAllCareers();
  }

  getAllCareers() {
    this.careerService.getAllCareers()
      .subscribe(
        res => {
          this.setCareers(res['ourCareers']);
          //console.log(res);
        },
        err => {
          this.errMsg = err.message;
        }
      )
  }

  setCareers(data) {
    for (let i = 0; i < data.length; ++i) {
      this.careerList.push({
        _id: data[i]._id,
        job_title: data[i].jobtitle,
      type: data[i].jobType,
      company: data[i].company,
      post_date: new Date(data[i].postedDate).toLocaleDateString()});
    }
    this.loadTable = true;
  }
}
