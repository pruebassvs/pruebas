import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { ENDPOINT } from '../../utils/utils';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { NewUser,UserRegistrationResponse, LoginResponse, LogoutResponse, UserLogin } from '../../types/types';
import Cookies from 'universal-cookie';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private cookies = new Cookies();
  public isLogged = new BehaviorSubject<boolean>(this.checkIsLogged());
  public isAdmin = new BehaviorSubject<boolean>(this.checkIsAdmin());
  public userEmail = new BehaviorSubject<string>(
    this.cookies.get('userEmail') || ''
  );

  constructor(private http: HttpClient) {}

  public checkIsLogged() {
    return !!this.cookies.get('token');
  }

  public checkIsAdmin() {
    return !!this.cookies.get('isAdmin');
  }

  public login(user: UserLogin): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${ENDPOINT}login/`, user).pipe(
      tap((response) => {
        const userEmail = response.user.email!;
        this.userEmail.next(userEmail);
        this.isLogged.next(true);
        this.cookies.set('userEmail', userEmail);
        this.cookies.set('token', response.token);
        if (response.is_staff) {
          this.isAdmin.next(response.is_staff);
          this.cookies.set('isAdmin', response.is_staff);
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  public register(user: NewUser): Observable<UserRegistrationResponse> {
    return this.http.post<UserRegistrationResponse>(`${ENDPOINT}register/`, user).pipe(
      catchError((error) => {
        console.error('Registration error:', error);
        throw error;
      })
    );
  }

  public logout(): Observable<LogoutResponse> {
    const token = this.cookies.get('token');
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http
      .post<LogoutResponse>(ENDPOINT + 'logout/', {}, { headers })
      .pipe(
        tap(() => {
          this.isLogged.next(false);
          this.isAdmin.next(false);
          this.cookies.remove('userEmail');
          this.cookies.remove('token');
          this.cookies.remove('isAdmin');
        }),
        catchError((error) => {
          console.error('Logout error:', error);
          throw error;
        })
      );
    }
  }