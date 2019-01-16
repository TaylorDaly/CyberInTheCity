import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {SignupService} from "../signup/signup.service";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SignupGuard implements CanActivate {

  constructor(private signupService: SignupService,
              private router: Router,) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean{
    const token = route.params.token;
    return true;
    // return this.signupService.canSignUp(token)
    //   .pipe(
    //     map(res => {
    //       console.log(res['auth']);
    //       if(res['auth']) {
    //         localStorage.setItem("signupEmail", res['email']);
    //         return res['auth'];
    //       } else {
    //         this.router.navigate(['login']);
    //         return false;
    //       }})
    //   );
  }
}

