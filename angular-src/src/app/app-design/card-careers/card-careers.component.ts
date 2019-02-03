import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-card-careers',
  templateUrl: './card-careers.component.html',
  styleUrls: ['./card-careers.component.css']
})
export class CardCareersComponent implements OnInit {

  @Input() link: string;
  @Input() title: string;
  @Input() hours: string;
  @Input() location: string;
  @Input() deadlineDate: string;
  @Input() description: string;

  constructor() { }

  ngOnInit() {
  }

}
