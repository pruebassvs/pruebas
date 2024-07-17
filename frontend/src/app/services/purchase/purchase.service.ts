import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PurchaseConfirmationResponse, Purchase } from '../../types/types';
import { ENDPOINT } from '../../utils/utils';
import { tap } from 'rxjs';
import { CartService } from '../cart/cart.service';
import { catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({ 
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private cartService:CartService, private http: HttpClient) { }

  public confirmPurchase(): Observable<PurchaseConfirmationResponse> { 
    return this.http.post<PurchaseConfirmationResponse>(ENDPOINT + 'purchase/confirm_purchase/', {}).pipe(
      tap(() => {
        this.cartService.getCart().subscribe();
      }),
      catchError((error) => {
        console.error(`Error occurred while confirming purchase:`, error);
        console.log(error)
        throw error;
      })
    );
    }

    public getPurchases(): Observable<Purchase[]> {
      return this.http.get<Purchase[]>(ENDPOINT + 'purchase/user_purchases/')
        .pipe(
          catchError((error) => {
            console.error('Error occurred while fetching purchases:', error);
            throw error;
          })
        );
    }
  }