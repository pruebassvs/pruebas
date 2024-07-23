import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PurchaseConfirmationResponse, Purchase , PaymentTypes} from '../../types/types';
import { ENDPOINT } from '../../utils/utils';
import { tap, finalize } from 'rxjs';
import { CartService } from '../cart/cart.service';
import { catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoaderService } from '../loader/loader.service';


@Injectable({ 
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private cartService:CartService, private http: HttpClient, private loaderService: LoaderService) { }

  public confirmPurchase(Payment_method_id: number): Observable<PurchaseConfirmationResponse> { 
    this.loaderService.show()
    return this.http.post<PurchaseConfirmationResponse>(ENDPOINT + 'purchase/confirm_purchase/', { Payment_method_id }).pipe(
      tap(() => {
          this.cartService.getCart().subscribe(); 
        }
      ),
      catchError((error) => {
        console.error(`Error occurred while confirming purchase:`, error);
        console.log(error)
        throw error;
      }),
      finalize(() => this.loaderService.hide())
    );
    }

    public getPaymentMethodTypes():Observable<PaymentTypes[]>{
      return this.http.get<PaymentTypes[]>(ENDPOINT + 'payment-mode/')
        .pipe(
          catchError((error) => {
            console.error('Error occurred while fetching purchases:', error);
            throw error;
          }),
        );
    }

    public getPurchases(): Observable<Purchase[]> {
      this.loaderService.show()
      return this.http.get<Purchase[]>(ENDPOINT + 'purchase/user_purchases/')
        .pipe(
          tap(() => {
              this.cartService.getCart().subscribe(); 
            },
          ),
          catchError((error) => {
            console.error('Error occurred while fetching purchases:', error);
            throw error;
          }),
          finalize(() => this.loaderService.hide())
        );
    }
  }