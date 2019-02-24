import { Component, OnInit } from '@angular/core';
import {SignupService} from "../signup/signup.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  signupEmail = "";
  message = "";
  error = "";

  constructor(private signupService: SignupService) { }

  ngOnInit() {
  }

  sendEmail() {
    this.signupService.sendSignupEmail(this.signupEmail + "@ucdenver.edu")
      .subscribe(
        response => {this.message = response.message},
        error => {this.error = error.message}
      );
  }
}
