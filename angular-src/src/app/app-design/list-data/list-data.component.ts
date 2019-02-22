import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-list-data',
  templateUrl: './list-data.component.html',
  styleUrls: ['./list-data.component.css']
})
export class ListDataComponent implements OnInit {

  @Input() listItems: any[];

  constructor() { }

  ngOnInit() {
  }

}
