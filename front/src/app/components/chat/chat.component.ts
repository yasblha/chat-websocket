import {
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectorRef,
    ViewChild,
    ElementRef
  } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { Router } from '@angular/router';
  import { AuthService } from '../../services/auth.service';
  import {
    ConversationService,
    Conversation,
    Message
  } from '../../services/conversation.service';
  import { io, Socket } from 'socket.io-client';
  import { environment } from '../../../environments/environment';
  import { FormsModule } from '@angular/forms';
  
  @Component({
    selector: 'app-chat',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
      <div class="min-h-screen bg-gray-100">
        <div class="container mx-auto px-4 py-8">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-2xl font-bold">Chat</h1>
            <button 
              (click)="logout()" 
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Déconnexion
            </button>
          </div>
  
          <div class="grid grid-cols-12 gap-4">
            <!-- Utilisateurs connectés -->
            <div class="col-span-3 bg-white rounded-lg shadow p-4">
              <h2 class="text-lg font-semibold mb-4">Utilisateurs connectés</h2>
              <div class="space-y-2">
                <div *ngFor="let user of connectedUsers" 
                     (click)="startConversation(user)"
                     class="p-3 rounded cursor-pointer hover:bg-gray-100 flex items-center gap-2"
                     [class.bg-green-50]="user.isOnline">
                  <div class="w-2 h-2 rounded-full" [class.bg-green-500]="user.isOnline" [class.bg-gray-300]="!user.isOnline"></div>
                  <div>
                    <div class="font-medium">{{ user.name }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Conversations -->
            <div class="col-span-3 bg-white rounded-lg shadow p-4">
              <h2 class="text-lg font-semibold mb-4">Conversations</h2>
              <div class="space-y-2">
                <div *ngFor="let conversation of conversations" 
                     (click)="selectConversation(conversation)"
                     class="p-3 rounded cursor-pointer hover:bg-gray-100"
                     [class.bg-blue-50]="selectedConversation?.id === conversation.id">
                  <div class="font-medium">
                    {{ conversation.user1.id === currentUser?.id ? conversation.user2.name : conversation.user1.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ conversation.messages.length > 0 ? conversation.messages[conversation.messages.length - 1].content : 'Aucun message' }}
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Zone de chat -->
            <div class="col-span-6 bg-white rounded-lg shadow">
              <div *ngIf="selectedConversation" class="h-[600px] flex flex-col">
                <!-- En-tête -->
                <div class="p-4 border-b">
                  <h3 class="font-semibold">
                    {{ selectedConversation.user1.id === currentUser?.id ? selectedConversation.user2.name : selectedConversation.user1.name }}
                  </h3>
                </div>
  
                <!-- Messages -->
                <div class="flex-1 overflow-y-auto p-4 space-y-4" #messageContainer>
                  <div *ngFor="let message of selectedConversation.messages" 
                       class="flex"
                       [class.justify-end]="message.senderId === currentUser?.id">
                    <div class="max-w-[70%] rounded-lg p-3"
                         [class.bg-blue-500]="message.senderId === currentUser?.id"
                         [class.text-white]="message.senderId === currentUser?.id"
                         [class.bg-gray-200]="message.senderId !== currentUser?.id">
                      {{ message.content }}
                    </div>
                  </div>
                </div>
  
                <!-- Zone de saisie -->
                <div class="p-4 border-t">
                  <form #messageForm="ngForm" (ngSubmit)="sendMessage()" class="flex gap-2">
                    <input
                      type="text"
                      #inputElement
                      [(ngModel)]="newMessage"
                      name="message"
                      placeholder="Écrivez votre message..."
                      class="flex-1 form-control"
                      (keyup.enter)="sendMessage()"
                      autocomplete="off"
                    >
                    <button 
                      type="submit"
                      class="btn btn-primary"
                      [disabled]="!newMessage.trim()"
                    >
                      Envoyer
                    </button>
                  </form>
                </div>
              </div>
  
              <div *ngIf="!selectedConversation" class="h-[600px] flex items-center justify-center text-gray-500">
                Sélectionnez une conversation ou un utilisateur pour commencer à discuter
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  })
  export class ChatComponent implements OnInit, OnDestroy {
    @ViewChild('inputElement') inputElement!: ElementRef;
    private socket: Socket;
    currentUser: any;
    conversations: Conversation[] = [];
    selectedConversation: Conversation | null = null;
    newMessage: string = '';
    connectedUsers: any[] = [];
  
    constructor(
      private authService: AuthService,
      private conversationService: ConversationService,
      private router: Router,
      private cdRef: ChangeDetectorRef
    ) {
      const token = this.authService.getToken();
  
      this.socket = io(`${environment.apiUrl}/chat`, {
        auth: { token }
      });
  
      this.socket.on('connect', () => console.log('Connecté au serveur WebSocket'));
      this.socket.on('connect_error', err => console.error('Erreur WS:', err));
      this.socket.on('error', err => console.error('Erreur WebSocket:', err));
    }
  
    ngOnInit() {
      this.currentUser = this.authService.getCurrentUser();
      if (!this.currentUser) {
        this.router.navigate(['/login']);
        return;
      }
  
      this.setupSocketListeners();
      this.loadConversations();
    }
  
    private setupSocketListeners() {
      this.socket.on('connect', () => {
        this.socket.emit('user:connect', { userId: this.currentUser.id });
      });
  
      this.socket.on('message:receive', (message: Message) => {
        let conversation = this.conversations.find(c => c.id === message.conversationId);
        if (!conversation) {
          conversation = {
            id: message.conversationId,
            user1: message.senderId === this.currentUser.id ? this.currentUser : message.sender,
            user2: message.senderId === this.currentUser.id ? message.receiver : this.currentUser,
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date()
          };
          this.conversations.push(conversation);
        }
        conversation.messages = [...(conversation.messages || []), message];
        if (this.selectedConversation?.id === conversation.id) {
          this.selectedConversation = { ...conversation };
        }
      });
  
      this.socket.on('message:sent', (message: Message) => {
        if (this.selectedConversation) {
          const index = this.selectedConversation.messages.findIndex(m => m.id === message.id);
          if (index !== -1) {
            this.selectedConversation.messages[index] = message;
          }
        }
      });
  
      this.socket.on('users:list', (users) => {
        this.connectedUsers = users.filter((u: any) => u.id !== this.currentUser.id);
      });
  
      this.socket.on('user:connected', (user) => {
        const existing = this.connectedUsers.find(u => u.id === user.id);
        if (!existing) {
          this.connectedUsers.push({ ...user, isOnline: true });
        } else {
          existing.isOnline = true;
        }
      });
  
      this.socket.on('user:disconnected', (userId) => {
        const user = this.connectedUsers.find(u => u.id === userId);
        if (user) user.isOnline = false;
      });
    }
  
    private loadConversations() {
      this.conversationService.getUserConversations().subscribe({
        next: (convs) => this.conversations = convs,
        error: (err) => console.error('Erreur chargement:', err)
      });
    }
  
    startConversation(user: any) {
      const existing = this.conversations.find(conv =>
        conv.user1.id === user.id || conv.user2.id === user.id
      );
  
      if (existing) {
        this.selectConversation(existing);
      } else {
        this.conversationService.createConversation(this.currentUser.id, user.id).subscribe({
          next: (conv) => {
            this.conversations.push(conv);
            this.selectConversation(conv);
          },
          error: (err) => console.error('Erreur création conversation:', err)
        });
      }
    }
  
    selectConversation(conv: Conversation) {
      this.selectedConversation = conv;
      this.conversationService.getConversationMessages(conv.id).subscribe({
        next: (messages) => this.selectedConversation!.messages = messages,
        error: (err) => console.error('Erreur chargement messages:', err)
      });
    }
  
    sendMessage() {
      if (!this.newMessage.trim() || !this.selectedConversation) return;
  
      const messageToSend = this.newMessage.trim();
      this.newMessage = '';
  
      const receiverId = this.selectedConversation.user1.id === this.currentUser.id
        ? this.selectedConversation.user2.id
        : this.selectedConversation.user1.id;
  
      const tempMessage: Message = {
        id: Date.now(),
        senderId: this.currentUser.id,
        receiverId,
        content: messageToSend,
        conversationId: this.selectedConversation.id,
        createdAt: new Date(),
        read: false
      };
  
      this.selectedConversation = {
        ...this.selectedConversation,
        messages: [...this.selectedConversation.messages, tempMessage]
      };
  
      this.socket.emit('message:send', {
        senderId: this.currentUser.id.toString(),
        receiverId: receiverId.toString(),
        content: messageToSend,
        conversationId: this.selectedConversation.id
      }, (error: any) => {
        if (error) {
          console.error('Erreur envoi message:', error);
          // Supprimer le message temporaire et restaurer
          this.selectedConversation!.messages = this.selectedConversation!.messages.filter(m => m.id !== tempMessage.id);
          this.newMessage = messageToSend;
        }
      });
  
      // Vider l'input et la variable immédiatement (avec un petit délai)
      setTimeout(() => {
        this.newMessage = '';
        if (this.inputElement) {
          this.inputElement.nativeElement.value = '';
        }
      }, 0);
  
      // Focus automatique sur l'input
      setTimeout(() => this.inputElement?.nativeElement?.focus(), 0);
    }
  
    logout() {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  
    ngOnDestroy() {
      this.socket?.disconnect();
    }
  }
  