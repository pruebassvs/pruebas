import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { ENDPOINT } from '../../utils/utils';
import { BehaviorSubject } from 'rxjs';
import { NewUser,UserRegistrationResponse, LoginResponse, LogoutResponse, UserLogin } from '../../types/types';
import Cookies from 'universal-cookie';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public cookies = new Cookies();
  public isLogged = new BehaviorSubject<boolean>(this.checkIsLogged());
  isLogged$=this.isLogged.asObservable()
  public isAdmin = new BehaviorSubject<boolean>(this.checkIsAdmin());
  isAdmin$= this.isAdmin.asObservable()
  public userEmail = new BehaviorSubject<string>(
    this.cookies.get('userEmail') || ''
  );

  constructor(private http: HttpClient) {}

  public checkIsLogged():boolean {
    const token = this.cookies.get('token');
    const expiresIn = this.cookies.get('expiresIn');
    if (token && expiresIn) {
      const now = new Date().getTime();
      const expirationTime = new Date(expiresIn).getTime();
      if (now < expirationTime) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  public checkIsAdmin():boolean {
    return !!this.cookies.get('isAdmin');
  }

  public getTokenExpirationDate(expiresIn: number): Date {
    const now = new Date();
    return new Date(now.getTime() + expiresIn * 1000); 
  }

  public login(user: UserLogin): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${ENDPOINT}login/`, user).pipe(
      tap((response) => {
        const userEmail = response.user.email!;
        const expiresIn = response.expires_in;
        const token = response.token
        const is_staff=response.is_staff
        this.createSession(userEmail, expiresIn, token, is_staff )
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

    return this.http
      .post<LogoutResponse>(ENDPOINT + 'logout/', {})
      .pipe(
        tap(() => {
          this.isLogged.next(false);
          this.isAdmin.next(false);
          this.cookies.remove('userEmail');
          this.cookies.remove('token');
          this.cookies.remove('isAdmin');
          this.cookies.remove('expiresIn');
        }),
        catchError((error) => {
          console.error('Logout error:', error);
          throw error;
        })
      );
    }
  private createSession(userEmail:string, expiresIn:number, token:string, is_staff:boolean):void{
    
    const expirationDate = this.getTokenExpirationDate(expiresIn).toISOString();
    this.userEmail.next(userEmail);
    this.isLogged.next(true);
    this.cookies.set('userEmail', userEmail);
    this.cookies.set('token', token);
    this.cookies.set('expiresIn', expirationDate);
    console.log(is_staff)
      if (is_staff) {
        this.isAdmin.next(is_staff);
        this.cookies.set('isAdmin', is_staff);
    }

  }

  
}