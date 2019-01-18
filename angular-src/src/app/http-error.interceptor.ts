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
        retry(3),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = "";
          if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // server-side error
            if(error.status >= 500) {
              errorMessage = `Error Code: ${error.status}\nMessage: Server Error`;
            }
            else if(error.error.message == null) {
              errorMessage = `Error Code: ${error.status}\nMessage: An error has occurred while handling the request.`;
            }
            else {
              errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
            }
          }
          window.alert(errorMessage);
          console.log(error);

          if(error.status === 403) {
            window.location.href = '/login';
          }
          return throwError(errorMessage);
        })
      )
  }
}
// Error Handler: https://medium.com/@aleixsuau/error-handling-angular-859d529fa53a
