import { Component, OnInit, Input } from '@angular/core';
import {Image, Link} from "../../person/person";
import {ResearchItem} from "../../research/research";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor(public sanitizer: DomSanitizer){ }
  @Input() _id: string;
  @Input() image: Image;
  @Input() name: string;
  @Input() role: string;
  @Input() email: string;
  @Input() biography: string;
  @Input() myWebsite: string;
  @Input() google_drive_link: string;
  @Input() socialLinks: Link[];
  @Input() phone_number: string;
  // @Input() research: ResearchItem[];
  ngOnInit() {
  }

}
