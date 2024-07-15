import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth-service/auth.service';
import { catchError, Observable, throwError  } from 'rxjs';


@Injectable()

export class authInterceptor implements HttpInterceptor  {
  
  constructor( private authService:AuthService) { }
  

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   
    if (this.authService.checkIsLogged()) {
      const token = this.authService.cookies.get('token');
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Token ${token}`,
          },
        });
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.authService.logout().subscribe();
        }
        return throwError(error);
      })
    );
  }
}