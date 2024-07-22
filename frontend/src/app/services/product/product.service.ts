import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { HttpClient} from '@angular/common/http';
import { ENDPOINT } from '../../utils/utils';
import {  NewProduct, Product } from '../../types/types';
import { Observable} from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
import { ShoeModelType, BrandType, SizeType, ColorType } from '../../types/types';
import { LoaderService } from '../loader/loader.service';


@Injectable({
  providedIn: 'root'
})
export class ProductService{
  
  
  constructor(private http: HttpClient, private loaderService: LoaderService) {}


  public getProducts(filters: any = {}): Observable<Product[]> {
    this.loaderService.show();
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
        throw error
      }),
      finalize(() => this.loaderService.hide())
    );
  }


  public getProductById(id: number): Observable<Product> {
    this.loaderService.show()
    return this.http.get<Product>(`${ENDPOINT}products/${id}/`).pipe(
      catchError((error) => {
        console.error(`Error occurred while fetching product with ID ${id}:`, error);
          throw error;
      }),
      finalize(() => this.loaderService.hide())
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
    this.loaderService.show()
    return this.http.patch<Product>(`${ENDPOINT}products/${id}/`, { stock }).pipe(
      catchError((error) => {
        console.error('Error occurred while updating product stock:', error);
        throw error;
      }),
      finalize(() => this.loaderService.hide())
    );
  }
  public addProduct(product: NewProduct): Observable<Product> {
    this.loaderService.show()
    return this.http.post<Product>(`${ENDPOINT}products/`, product)
      .pipe(
        catchError((error) => {
        console.error('Error occurred while adding product:', error);
        throw error;
      }),
      finalize(() => this.loaderService.hide())
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
  
