import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { HttpClient} from '@angular/common/http';
import { ENDPOINT } from '../../utils/utils';
import {  NewProduct, Product } from '../../types/types';
import { Observable} from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProductService{
  
  
  constructor(private http: HttpClient) {}

  public getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${ENDPOINT}products/`).pipe(
      catchError((error) => {
        console.error('Error occurred while fetching products:', error);
        throw error;
      }
    ))
  }

  public getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${ENDPOINT}products/${id}/`).pipe(
      catchError((error) => {
        console.error(`Error occurred while fetching product with ID ${id}:`, error);
          throw error;
      })
    );
  }
  public getRandomProductExcluding(currentProductId: number): Observable<Product> {
    const params = new HttpParams().set('currentProductId', currentProductId.toString());
    return this.http.get<Product>(`${ENDPOINT}products/get_random_product_excluding_id/`, { params }).pipe(
      catchError((error) => {
        console.error('Error occurred while fetching random product:', error);
        throw error;
      })
    );
  }
  public patchProductStock(id: number, stock: number): Observable<Product> {
    return this.http.patch<Product>(`${ENDPOINT}products/${id}/`, { stock }).pipe(
      catchError((error) => {
        console.error('Error occurred while updating product stock:', error);
        throw error;
      })
    );
  }
  public addProduct(product: NewProduct): Observable<NewProduct> {
    return this.http.post<NewProduct>(`${ENDPOINT}products/`, product)
      .pipe(catchError((error) => {
        console.error('Error occurred while adding product:', error);
        throw error;
      })
    );
  }
}
  
