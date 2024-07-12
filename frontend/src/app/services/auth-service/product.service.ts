import { Injectable } from '@angular/core';

import { HttpClient} from '@angular/common/http';
import { ENDPOINT } from '../../utils/utils';
import {  Product } from '../../types/types';
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
  
}