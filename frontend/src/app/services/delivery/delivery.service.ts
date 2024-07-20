import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Delivery, DeliveryStatusResponse, UpdateDeliveryStatusRequest } from '../../types/types';
import { ENDPOINT } from '../../utils/utils';
import { catchError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  constructor(private http: HttpClient) {}

  getDeliveries(): Observable<Delivery[]> {
    return this.http.get<Delivery[]>(`${ENDPOINT}deliveries/`).pipe(
      catchError((error) => {
        console.error('Error occurred while updating product stock:', error);
        throw error;
      })
    );
  }
  

  updateDeliveryStatus(request: UpdateDeliveryStatusRequest): Observable<DeliveryStatusResponse> {
    return this.http.patch<DeliveryStatusResponse>(`${ENDPOINT}deliveries/`, request).pipe(
      catchError((error) => {
        console.error('Error occurred while updating product stock:', error);
        throw error;
      })
    );
  }
  }


