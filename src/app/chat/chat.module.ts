import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './pages/chat/chat.component';
import { ChatRoutingModule } from './chat-routing.module';
import { MessageListComponent } from './components/message-list/message-list.component';
import { SendMessageComponent } from './components/send-message/send-message.component';
import { MessageComponent } from './components/message/message.component';
import { SharedModule } from '../shared/shared.module';
import { LikeComponent } from './components/like/like.component';

@NgModule({
  imports: [
    CommonModule,
    ChatRoutingModule,
    SharedModule
  ],
  declarations: [ChatComponent, MessageComponent, MessageListComponent, SendMessageComponent, LikeComponent]
})
export class ChatModule { }
