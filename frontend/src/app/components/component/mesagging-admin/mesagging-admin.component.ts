import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessagingService } from '../../../services/messaging/messaging.service';
import { Conversation, Message, NewMessage } from '../../../types/types';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderByPipe } from '../../../pipes/order-by.pipe';

@Component({
  selector: 'app-mesagging-admin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, OrderByPipe],
  templateUrl: './mesagging-admin.component.html',
  styleUrl: './mesagging-admin.component.css'
})
export class MesaggingAdminComponent implements OnInit {
  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  messages: Message[] = [];
  messageForm: FormGroup;

  constructor(
    private messagingService: MessagingService,
    private fb: FormBuilder
  ) {
    this.messageForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadConversations();
  }

  loadConversations(): void {
    this.messagingService.getConversations().subscribe({
      next: (conversations: Conversation[]) => {
        this.conversations = conversations;
      },
      error: (error) => {
        console.error('Error loading conversations', error);
      }
    });
  }

  selectConversation(conversation: Conversation): void {
    this.selectedConversation = conversation;
    this.loadMessages(conversation.id);
  }

  loadMessages(conversationId: number): void {{
    this.messagingService.getMessages(conversationId).subscribe({
      next :(data: Message[]) => {
        this.messages = data;
      },
      error: (error) => {
        console.error('Error loading messages', error);
      }
  })
  }}

  sendMessage(event:Event): void {
    if (this.selectedConversation) {
      const content = this.messageForm.get('content')?.value;
      const newMessage: NewMessage = {
        content,
        conversation: this.selectedConversation.id
      };
      this.messagingService.createMessage(newMessage).subscribe({
        next: (message: Message) => {
          this.messages.unshift(message);
          this.messageForm.reset();
        },
        error: (error) => {
          console.error('Error sending message', error);
        }
      });
    }
  }

  closeConversation(conversationId: number): void {
    this.messagingService.closeConversation(conversationId).subscribe({
      next: () => {
        this.loadConversations();
        this.selectedConversation = null;
      },
      error: (error) => {
        console.error('Error closing conversation', error);
      }
    });
  }

  deleteConversation(conversationId: number): void {
    if (confirm('Are you sure you want to delete this conversation?')) {
      this.messagingService.deleteConversation(conversationId).subscribe({
        next: () => {
          this.loadConversations();
          this.selectedConversation = null;
        },
        error: (error) => {
          console.error('Error deleting conversation', error);
        }
      });
    }
  }
}