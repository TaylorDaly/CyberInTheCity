import {Component, OnInit} from '@angular/core';
import {CareersService} from "../Services/careers.service";
import {CareersItem} from "./careers";

@Component({
  selector: 'app-careers',
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.css']
})
export class CareersComponent implements OnInit {
  ourCareers: CareersItem[];
  fullTime: CareersItem[];
  internship: CareersItem[];
  displayF: boolean = false;
  displayI: boolean = false;
  displayT: boolean = true;
  listingSelected: number;
  arrayString: string;
  error = "";
  JobListing: ({ name: string; ID: number })[];

  constructor(private careersService: CareersService) {
  }

  ngOnInit() {
    this.getAllCareers();
    this.JobListing = [
      {ID: 1, name: "All"},
      {ID: 2, name: "Full Time"},
      {ID: 3, name: "Internship"}
    ];

    this.listingSelected = 1; //to default to all
  }

  onListingSelected(val: any) {
    this.customFunction(val);
  }

  customFunction(val: any) {
    if (val == 1) {
      this.displayI = false;
      this.displayF = false;
      this.displayT = true;
      this.arrayString = "total";
    }
    if (val == 2) {
      this.displayI = false;
      this.displayF = true;
      this.displayT = false;
      this.arrayString = "fullTime";
    }
    if (val == 3) {
      this.displayI = true;
      this.displayF = false;
      this.displayT = false;
      this.arrayString = "internship";
    }
  }

  private getAllCareers() {
    this.careersService.getAllCareers()
      .subscribe(
        res => {
          this.fullTime = res.fullTime;
          this.internship = res.internship;
          this.ourCareers = res.ourCareers;
        },
        err => {
          this.error = err.message;
        }
      )
  }
}
