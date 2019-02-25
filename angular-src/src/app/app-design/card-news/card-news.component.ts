import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-card-news',
  templateUrl: './card-news.component.html',
  styleUrls: ['./card-news.component.css']
})
export class CardNewsComponent implements OnInit {

  @Input() URL: string;
  @Input() title: string;
  @Input() jobType: string;
  @Input() imageLink: string;
  @Input() createdOn: string;
  @Input() createdBy: string;
  @Input() content: string;

  constructor() { }

  ngOnInit() {
  }

}
