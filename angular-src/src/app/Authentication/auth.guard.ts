import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {SignupService} from "../signup/signup.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SignupGuard implements CanActivate {

  constructor(private signupService: SignupService,
              private router: Router,) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean{
    // const token = route.params.token;
    // localStorage.setItem("token", token);
    // // this.router.navigateByUrl('/register');
    // // return false;
    // return this.signupService.canSignUp(token)
    //   .pipe(
    //     map(res => {
    //       console.log(res['auth']);
    //       if(res['auth']) {
    //         localStorage.setItem("signupEmail", res['email']); // Place in session Later //
    //         return res['auth'];
    //       } else {
    //         //this.router.navigateByUrl('/register');
    //         return false;
    //       }}),
    //   );
    return true;
  }
}

