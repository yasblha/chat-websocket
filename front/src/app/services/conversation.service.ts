import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Conversation {
  id: number;
  user1: {
    id: number;
    name: string;
    email: string;
  };
  user2: {
    id: number;
    name: string;
    email: string;
  };
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  conversationId: number;
  createdAt: Date;
  read: boolean;
  sender?: {
    id: number;
    name: string;
    email: string;
  };
  receiver?: {
    id: number;
    name: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUserConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${environment.apiUrl}/conversations`, {
      headers: this.getHeaders()
    });
  }

  createConversation(user1Id: number, user2Id: number): Observable<Conversation> {
    return this.http.post<Conversation>(`${environment.apiUrl}/conversations`, {
      user1Id,
      user2Id
    }, {
      headers: this.getHeaders()
    });
  }

  getConversationMessages(conversationId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${environment.apiUrl}/conversations/${conversationId}/messages`, {
      headers: this.getHeaders()
    });
  }

  searchConversationMessages(conversationId: number, query: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${environment.apiUrl}/message/search/${conversationId}?query=${query}`, {
      headers: this.getHeaders()
    });
  }
} 