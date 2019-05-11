import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {PersonService} from "../Services/person.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  errMsg = "";

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  constructor(private fb: FormBuilder,
              private  personService: PersonService,
              private router: Router) { }

  ngOnInit() {
  }

  loginUser() {
    //console.log(this.loginForm.value);
    this.personService.loginPerson(this.loginForm.value)
      .subscribe(
        res => {
          sessionStorage.setItem('jwtToken', res['token']);
          sessionStorage.setItem('sys_role', res['sys_role']);
          this.router.navigateByUrl('/user-menu').catch((err) => this.errMsg = err.message);
        },
        err => {
          //window.alert(`Error ${err.code}: ${err.message}`);
          this.errMsg = err.message;
        }
      );
  }
}
