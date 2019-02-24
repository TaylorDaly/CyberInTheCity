import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-card-careers',
  templateUrl: './card-careers.component.html',
  styleUrls: ['./card-careers.component.css']
})
export class CardCareersComponent implements OnInit {

  @Input() url: string;
  @Input() jobtitle: string;
  @Input() company: string;
  @Input() jobType: string;
  @Input() location: string;
  @Input() postedDate: string;
  @Input() description: string;

  constructor() { }

  ngOnInit() {
  }

}
