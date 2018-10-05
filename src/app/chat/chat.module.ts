import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './pages/chat/chat.component';
import { LikeComponent } from './components/like/like.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { MessageComponent } from './components/message/message.component';
import { SendMessageComponent } from './components/send-message/send-message.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    ChatComponent,
    LikeComponent,
    MessageListComponent,
    MessageComponent,
    SendMessageComponent
  ]
})
export class ChatModule { }
