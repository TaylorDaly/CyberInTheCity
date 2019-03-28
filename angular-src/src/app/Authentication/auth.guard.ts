import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {SignupService} from "../Services/signup.service";
import {Observable, of} from "rxjs";
import {map, catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SignupGuard implements CanActivate {

  constructor(private signupService: SignupService,
              private router: Router,) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean{
    const token = route.params.token;
    //console.log(token);

    return this.signupService.canSignUp(token)
      .pipe(
        map(res => {
          localStorage.setItem("token", token);
          //console.log(localStorage.getItem('token'));
          localStorage.setItem("signupEmail", res['email']);
          return res['auth'];
        }),
        catchError((err) => {
          window.alert(`Error ${err.code}: ${err.message}`);
          this.router.navigateByUrl('/home');
          console.log(token);
          return of(false);
        })
      );
    //return true;
  }
}

