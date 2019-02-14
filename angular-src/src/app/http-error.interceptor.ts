import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {retry, catchError} from 'rxjs/operators';

export class HttpErrorInterceptor implements HttpInterceptor {

  errorCode: number;
  errorMessage: string;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          // Default Error message: //
          let err = {
            code: 500,
            message: "An error occurred while handling the request"
          };

          if (error instanceof ErrorEvent) {
            // client-side error
            err.code = error.status;
            err.message = error.message;
          } else {
            // server-side error
            if(error.status >= 500) {  // For all server errors //
              err.code = error.status;
              err.message = "Oh no! A server error has occurred.";
            }
            else {
              err.code = error.status;
              err.message = error.error.message;
            }
          }
          //window.alert(errorMessage);
          console.log(error);

          // if(error.status === 403) {
          //   //window.location.href = '/login';
          // }
          return throwError(err);
        })
      )
  }
}
// Error Handler: https://medium.com/@aleixsuau/error-handling-angular-859d529fa53a
