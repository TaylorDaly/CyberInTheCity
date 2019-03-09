import { Component, OnInit, Input } from '@angular/core';
import {Image, Link} from "../../person/person";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor() { }
  @Input() _id: string;
  @Input() image: Image;
  @Input() name: string;
  @Input() role: string;
  @Input() email: string;
  @Input() myWebsite: string;
  @Input() socialLinks: Link[];
  ngOnInit() {
  }

}
