import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {SignupService} from "../signup/signup.service";
import {map} from "rxjs/operators";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SignupGuard implements CanActivate {

  constructor(private signupService: SignupService,
              private router: Router,) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const token = route.params.token;
    return this.signupService.canSignUp(token)
      .pipe(
        map(res => {
          console.log(res['auth']);
          if(res['auth']) {
            return true;
          } else {
            this.router.navigate(['login']);
            return false;
          }})
      );
  }
}

