import { Component, OnInit } from '@angular/core';
import {SignupService} from "./signup.service";
import {FormBuilder, FormArray} from "@angular/forms";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  links = ['Facebook', 'Twitter', 'LinkedIn', 'Google', 'RSS'];

  signupForm = this.fb.group({
    email: [localStorage.getItem('signupEmail')],
    firstName: [''],
    lastName: [''],
    password: [''],
    confirmPassword: [''],
    myWebsite: [''],
    sslinks: this.fb.array([
      this.fb.group({
        URL: [''],
        description: ['']
      })
    ])
  });

  inputLength = "col-md-9";

  constructor(private signupService: SignupService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
  }

  get sslinks(){
    return this.signupForm.get('sslinks') as FormArray;
  }

  addSSLinks() {
    this.inputLength = 'col-md-8';
    this.sslinks.push(this.fb.group({
      URL: [''],
      description: ['']
    }));
  }

  deleteSSLinks(index: number) {
    this.sslinks.removeAt(index);
    if(this.sslinks.length <= 1)
      this.inputLength = 'col-md-9';
  }

}
