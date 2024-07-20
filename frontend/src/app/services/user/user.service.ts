import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENDPOINT } from '../../utils/utils';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs';
import { User } from '../../types/types';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUser():Observable<User>{
    return this.http.get<User>(ENDPOINT + 'user/').pipe(
      catchError((error) => {
        console.error('Error occurred while fetching user:', error);
        throw error;
      })
    );
  }

  updateUser(data: Partial<User>): Observable<User> {
    return this.http.patch<User>(ENDPOINT + 'user/update/', data).pipe(
      catchError((error) => {
        console.error('Error occurred while updating user:', error);
        throw error;
      })
    );
}
}

