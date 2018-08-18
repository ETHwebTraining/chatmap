import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './pages/chat/chat.component';
import { ChatRoutingModule } from './chat-routing.module';
import { MessageComponent } from '../chat.components/message/message.component';
import { MessageListComponent } from './components/message-list/message-list.component';

@NgModule({
  imports: [
    CommonModule,
    ChatRoutingModule
  ],
  declarations: [ChatComponent, MessageComponent, MessageListComponent]
})
export class ChatModule { }
