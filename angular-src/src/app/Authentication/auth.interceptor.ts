import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const jwtToken = sessionStorage.getItem('jwtToken');
    if(jwtToken) {
      const cloned = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + jwtToken)
      });
      return next.handle(cloned);
    } else {
      return next.handle(request);
    }
  }
}
