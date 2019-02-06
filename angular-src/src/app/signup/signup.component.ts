import { Component, OnInit } from '@angular/core';
import {SignupService} from "./signup.service";
import {FormBuilder, FormArray, Validators} from "@angular/forms";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  // List of SM Link options: //
  links = ['Facebook', 'Twitter', 'LinkedIn', 'Google', 'RSS'];

  signupForm = this.fb.group({
    email: [localStorage.getItem('signupEmail')],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    password: ['', [Validators.required]],
    confirmPassword: ['',[Validators.required]],
    myWebsite: [''],
    smLinks: this.fb.array([
      this.fb.group({
        URL: [''],
        description: ['']
      })
    ])
  });

  linkLength = "col-md-9";  // SM Link URL input box length //
  linksLimit = false;  // Limit of SM Link inputs //

  get firstName() {
    return this.signupForm.get('firstName');
  }
  get lastName() {
    return this.signupForm.get('lastName');
  }
  get password() {
    return this.signupForm.get('password');
  }
  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }
  get smLinks(){
    return this.signupForm.get('smLinks') as FormArray;
  }

  constructor(private signupService: SignupService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
  }

  addSMLinks() {
    this.linkLength = 'col-md-8';
    if(this.smLinks.length < 5) {
      this.smLinks.push(this.fb.group({
        URL: [''],
        description: ['']
      }));
    } else {
      this.linksLimit = true;
    }
  }

  deleteSMLinks(index: number) {
    this.linksLimit = false;
    this.smLinks.removeAt(index);
    if(this.smLinks.length <= 1)
      this.linkLength = 'col-md-9';
  }

}
