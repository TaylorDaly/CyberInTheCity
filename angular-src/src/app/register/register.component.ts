import { Component, OnInit } from '@angular/core';
import {SignupService} from "../signup/signup.service";
import {FormBuilder, Validators} from "@angular/forms";
import {regex} from "../../environments/environment";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm = this.fb.group({
    signupEmail: ['', [Validators.required, Validators.pattern(regex.email)]]
  });

  message = "";
  error = "";

  get signupEmail() {
    return this.registerForm.get('signupEmail');
  }

  constructor(private signupService: SignupService,
              private fb: FormBuilder) { }

  ngOnInit() {
  }

  sendEmail() {
    this.signupService.sendSignupEmail(this.signupEmail.value)
      .subscribe(
        response => {
          this.message = response.message;
          this.error = "";
        },
        error => {
          this.error = error.message;
          this.message = "";
        }
      );
  }
}
