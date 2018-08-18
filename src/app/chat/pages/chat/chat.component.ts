import { switchMap, tap, map, startWith, filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { Observable } from 'rxjs';
import { AppMessage } from '../../../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public messages$: Observable<AppMessage[]>;
  public isTyping$: Observable<string>;
  public placeName$: Observable<string>;

  private placeId: string;

  constructor(
    private chat: ChatService,
    public current: UserService,
    private AR: ActivatedRoute,
    public loc: Location
  ) { }

  ngOnInit() {
    this.messages$ = this.AR.queryParamMap.pipe(
      map((data) => data.get('placeId')),
      tap((id) => this.placeId = id ),
      switchMap((id) => this.chat.getMessages(id))
    );

    this.isTyping$ = this.AR.queryParamMap.pipe(
      map((data) => data.get('placeId')),
      switchMap((id) => this.chat.getisTyping(id)),
      map((val) => val || 'Enter a message...' )
    );

    this.placeName$ = this.AR.queryParamMap.pipe(
      map((data) => data.get('placeName')),
    );
  }


  public onSend(message: AppMessage) {
    this.chat.sendMessage(this.placeId, message);
  }

}
