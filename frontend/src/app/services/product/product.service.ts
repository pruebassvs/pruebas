import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { HttpClient} from '@angular/common/http';
import { ENDPOINT } from '../../utils/utils';
import {  NewProduct, Product } from '../../types/types';
import { Observable} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ShoeModelType, BrandType, SizeType, ColorType } from '../../types/types';


@Injectable({
  providedIn: 'root'
})
export class ProductService{
  
  
  constructor(private http: HttpClient) {}


  public getProducts(filters: any = {}): Observable<Product[]> {
    let params = new HttpParams();

    if (filters.brand) {
      params = params.set('brand', filters.brand);
    }
    if (filters.min_price) {
      params = params.set('min_price', filters.min_price);
    }
    if (filters.max_price) {
      params = params.set('max_price', filters.max_price);
    }
    if (filters.has_stock !== undefined) {
      params = params.set('has_stock', filters.has_stock);
    }
    return this.http.get<Product[]>(`${ENDPOINT}products/`, { params }).pipe(
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
  public addProduct(product: NewProduct): Observable<Product> {
    return this.http.post<Product>(`${ENDPOINT}products/`, product)
      .pipe(catchError((error) => {
        console.error('Error occurred while adding product:', error);
        throw error;
      })
    );
  }
  getShoeModels(): Observable<ShoeModelType[]> {
    return this.http.get<ShoeModelType[]>(`${ENDPOINT}model/`).pipe(
      catchError((error) => {
        console.error(`Error occurred while fetching models:`, error);
          throw error;
      })
    );
  }
  getBrands(): Observable<BrandType[]> {
    return this.http.get<BrandType[]>(`${ENDPOINT}brand/`).pipe(
      catchError((error) => {
        console.error(`Error occurred while fetching brands:`, error);
          throw error;
      })
    );
  }
  getSizes(): Observable<SizeType[]> {
    return this.http.get<SizeType[]>(`${ENDPOINT}size/`).pipe(
      catchError((error) => {
        console.error(`Error occurred while fetching sizes:`, error);
          throw error;
      })
    );
  }

  getColors(): Observable<ColorType[]> {
    return this.http.get<ColorType[]>(`${ENDPOINT}color/`).pipe(
      catchError((error) => {
        console.error(`Error occurred while fetching colors:`, error);
          throw error;
      })
    );
  }
}
  
