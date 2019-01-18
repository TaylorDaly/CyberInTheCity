import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-card-info',
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.css']
})
export class CardInfoComponent implements OnInit {

  @Input() header: string;
  @Input() body: string;
  @Input() footer: string;

  constructor() { }

  ngOnInit() {
  }

}
