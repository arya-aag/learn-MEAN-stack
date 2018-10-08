import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material';
import { Injectable } from '@angular/core';
import { ErrorComponent } from './error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        let errMsg = 'An unknown error occurred!';
        if (err.error.message) {
          errMsg = err.error.message;
        }
        this.dialog.open(ErrorComponent, {
          width: '480px',
          data: { message: errMsg }
        });

        return throwError(err);
      })
    );
  }
}
