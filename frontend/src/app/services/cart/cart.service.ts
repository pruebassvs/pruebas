import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddProductResponse, Cart, NewItem, PurchaseConfirmationResponse, RemoveItemRequest, RemoveItemResponse } from '../../types/types';
import { ENDPOINT } from '../../utils/utils';
import { catchError } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>({} as Cart);
  cartSubject$=this.cartSubject.asObservable()
  private totalSubject = new BehaviorSubject<number>(0);
  public total$ = this.totalSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialCart();
  }

  private loadInitialCart(): void {
    this.getCart().subscribe();
    
  }
  private updateTotal(cart: Cart): void {
    const total = cart.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
    this.totalSubject.next(total);
  }

  public getCart(): Observable<Cart> {
    return this.http.get<Cart>(ENDPOINT + 'cart/get_items/').pipe(
      tap(cart => {
        this.cartSubject.next(cart);
        this.updateTotal(cart);
      }),
      catchError((error) => {
        console.error(`Error occurred while fetching cart items:`, error);
        throw error;
      })
    );
  }

  public addItem(product_id: number, quantity: number): Observable<AddProductResponse> {
    const newItem: NewItem = { product_id, quantity };
    return this.http.post<AddProductResponse>(ENDPOINT + 'cart/add_product/', newItem).pipe(
      tap(() => {
        this.getCart().subscribe();
      }),
      catchError((error) => {
        console.error(`Error occurred while adding product:`, error);
        throw error;
      })
    );
  }

  public deleteItem(item_id: number): Observable<RemoveItemResponse> {
    const removeItem: RemoveItemRequest = { item_id };
    return this.http.delete<RemoveItemResponse>(ENDPOINT + 'cart/remove_item/', { body: removeItem }).pipe(
      tap(() => {
        this.getCart().subscribe();
      }),
      catchError((error) => {
        console.error(`Error occurred while deleting product with ID:`, error);
        throw error;
      })
    );
  }

}