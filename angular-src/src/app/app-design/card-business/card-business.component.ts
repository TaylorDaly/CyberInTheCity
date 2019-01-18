import { Component, OnInit, Input } from '@angular/core';
import {Image, Link} from "../../person/person";

@Component({
  selector: 'app-card-business',
  templateUrl: './card-business.component.html',
  styleUrls: ['./card-business.component.css']
})
export class CardBusinessComponent implements OnInit {

  @Input() image: Image;
  @Input() name: string;
  @Input() role: string;
  @Input() email: string;
  @Input() myWebsite: string;
  @Input() socialLinks: Link[];

  constructor() { }

  ngOnInit() {
  }

}
