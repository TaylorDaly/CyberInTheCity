import { Component, OnInit } from '@angular/core';
import {CareersService} from "./careers.service";
import {CareersItem} from "./careers";

@Component({
  selector: 'app-careers',
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.css']
})
export class CareersComponent implements OnInit {

  careers: CareersItem[];
  error = "";

  constructor(private careersService: CareersService) { }

  ngOnInit() {
    this.getAllCareers();
  }

  private getAllCareers() {
    this.careersService.getAllCareers()
      .subscribe(
        res => {
          this.careers = res;
        },
        err => {
          this.error = err["error"].message;
        }
      )
  }
}
