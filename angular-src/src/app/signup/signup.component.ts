import { Component, OnInit } from '@angular/core';
import {SignupService} from "./signup.service";
import {FormBuilder, Validators, FormGroup, FormArray} from "@angular/forms";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  links = ['Facebook', 'Twitter', 'LinkedIn', 'Google', 'RSS'];
  signupItems = {
    email: localStorage.getItem("signupEmail"),
    name: "",
    password: "",
    my_website_link: "",
    links: [
      {
        URL: "",
        description: ""
      }
    ],
    photo: {}
  };

  constructor(private signupService: SignupService) { }

  ngOnInit() {
  }

}
