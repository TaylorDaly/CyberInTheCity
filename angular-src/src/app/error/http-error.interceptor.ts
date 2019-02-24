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
        catchError((errRes: HttpErrorResponse) => {
            // Default Error message: //
            let err = {
              code: 500,
              message: "An errRes occurred while handling the request."
            };

            if (errRes instanceof ErrorEvent) {
              // client-side errRes
              err.code = errRes.status;
              err.message = errRes.message;
            } else {
              // server-side errRes
              if(errRes.status >= 500 || errRes.status == 0) {  // For all server errors //
                // TODO: create 500 page - Full page with NO Nav shown //
                // err.code = errRes.status;
                // err.message = errRes.errRes.message;
              }
              else {
                err.code = errRes.status;
                err.message = errRes.error.message;
                //window.alert(`Error ${err.code}: ${err.message}`);
              }
            }

            console.log(errRes);

            // if(errRes.status === 403) {
            //   //window.location.href = '/login';
            // }
            return throwError(err);
          })
      )
  }
}
// Error Handler: https://medium.com/@aleixsuau/error-handling-angular-859d529fa53a
