import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Conversation, Message, NewMessage } from '../../types/types';
import { ENDPOINT } from '../../utils/utils';
import { LoaderService } from '../loader/loader.service';
import { catchError } from 'rxjs';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  constructor(private http: HttpClient,private loaderService: LoaderService) {}

  // Conversaciones
  getConversations(): Observable<Conversation[]> {
    this.loaderService.show();
    return this.http.get<Conversation[]>(`${ENDPOINT}conversations/`).pipe(
      catchError((error) => {
        console.error('Error occurred while sending Email :', error);
        throw error;
      }),
      finalize(() => this.loaderService.hide())
    );
  }  
  

  createConversation(): Observable<Conversation> {
    this.loaderService.show();
    return this.http.post<Conversation>(`${ENDPOINT}conversations/`,{}).pipe(
      catchError((error) => {
        console.error('Error occurred while sending Email :', error);
        throw error;
      }),
      finalize(() => this.loaderService.hide())
    );
  }  

  deleteConversation(id: number): Observable<void> {
    this.loaderService.show();
    return this.http.delete<void>(`${ENDPOINT}conversations/${id}/`).pipe(
      catchError((error) => {
        console.error('Error occurred while sending Email :', error);
        throw error;
      }),
      finalize(() => this.loaderService.hide())
    );
  }  
  closeConversation(id: number): Observable<Conversation> {
    this.loaderService.show();
    return this.http.post<Conversation>(`${ENDPOINT}${id}/close/`, {}).pipe(
      catchError((error) => {
        console.error('Error occurred while sending Email :', error);
        throw error;
      }),
      finalize(() => this.loaderService.hide())
    );
  }  

  // Mensajes
  createMessage(message:NewMessage): Observable<Message> {
    this.loaderService.show();
    return this.http.post<Message>(`${ENDPOINT}messages/`, message).pipe(
      catchError((error) => {
        console.error('Error occurred while sending Email :', error);
        throw error;
      }),
      finalize(() => this.loaderService.hide())
    );
  }  

  getMessages(conversationId: number): Observable<Message[]> {
    this.loaderService.show();
    return this.http.get<Message[]>(`${ENDPOINT}messages/?conversation=${conversationId}`).pipe(
      catchError((error) => {
        console.error('Error occurred while sending Email :', error);
        throw error;
      }),
      finalize(() => this.loaderService.hide())
    );
  }  
}