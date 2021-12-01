import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StorageService } from '../_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private storage: StorageService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            const code = err?.error?.code || '';
            if(code==='TOKEN_MISSING' || code==='TOKEN_EXPIRED'){
                this.storage.logout();
            }
            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}