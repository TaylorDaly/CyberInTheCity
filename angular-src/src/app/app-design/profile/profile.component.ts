import { Component, OnInit, Input } from '@angular/core';
import {Image, Link} from "../../person/person";
import {ResearchItem} from "../../research/research";
import { DomSanitizer } from '@angular/platform-browser';
import {HttpClient} from "@angular/common/http";
import {PersonService} from "../../Services/person.service";
import {ResearchService} from "../../Services/research.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor(private http: HttpClient,
              private personService: PersonService,
              public sanitizer: DomSanitizer,
              private researchService: ResearchService){ }
  person = [];
  error = '';
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
    this.getAllPeople();

  }

  getAllPeople() {
    this.personService.getVerifiedPeople()
      .subscribe(
        response => {
          this.person = response;
          //console.log(response)
        },
        error => this.error = error
      );
  }

  // getPerson(_id) {
  //   // this.displayAll = false;
  //   // this.displayPerson = true;
  //   this.personService.getPerson(_id)
  //     .subscribe(
  //       response => {
  //         this.person = response;
  //         // console.log(response)
  //         // this.router.navigateByUrl('/profile');
  //       },
  //       error => this.error = error
  //     );
  //   this.personService.getPersonResearch(_id)
  //     .subscribe(
  //       res => {
  //         this.personResearch = res;
  //         console.log(res);
  //       },
  //       error => this.error = error
  //     )
  // }


}
