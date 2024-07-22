import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Delivery, DeliveryStatusResponse, UpdateDeliveryStatusRequest } from '../../types/types';
import { ENDPOINT } from '../../utils/utils';
import { catchError } from 'rxjs';
import { LoaderService } from '../loader/loader.service';
import { tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  constructor(private http: HttpClient, private loaderService: LoaderService) {}

  getDeliveries(): Observable<Delivery[]> {
    this.loaderService.show();
    return this.http.get<Delivery[]>(`${ENDPOINT}deliveries/`).pipe(
      tap({
        next: () => this.loaderService.hide(),
        error: () => this.loaderService.hide()
      }),
      catchError((error) => {
        console.error('Error occurred while updating product stock:', error);
        throw error;
      })
    );
  }
  

  updateDeliveryStatus(request: UpdateDeliveryStatusRequest): Observable<DeliveryStatusResponse> {
    this.loaderService.show();
    return this.http.patch<DeliveryStatusResponse>(`${ENDPOINT}deliveries/`, request).pipe(
       tap({
        next: () => this.loaderService.hide(),
        error: () => this.loaderService.hide()
      }),
      catchError((error) => {
        console.error('Error occurred while updating product stock:', error);
        throw error;
      })
    );
  }
  }


