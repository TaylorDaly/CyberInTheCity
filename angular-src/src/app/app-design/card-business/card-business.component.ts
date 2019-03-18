import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {Image, Link} from "../../person/person";

@Component({
  selector: 'app-card-business',
  templateUrl: './card-business.component.html',
  styleUrls: ['./card-business.component.css']
})
export class CardBusinessComponent implements OnInit {

  @Input() _id: string;
  @Input() image: Image;
  @Input() name: string;
  @Input() role: string;
  @Input() email: string;
  @Input() myWebsite: string;
  @Input() socialLinks: Link[];
  @Output() personId = new EventEmitter();

  passEmail = [];

  constructor() { }

  ngOnInit() {
    this.passEmail = this.email.split('@');
  }

  getPerson(val: any) {
    console.log(val);
    this.personId.emit(val);
  }

}
