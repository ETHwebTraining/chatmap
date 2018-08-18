import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { AppMessage } from '../models/user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private afs: FirestoreService
  ) { }

  public getMessages(placeId: string) {
    return this.afs.colWithIds$(`places/${placeId}/messages`, ref => ref.orderBy('createdAt', 'asc'));
  }

  public updateIsTyping(placeId: string, content: string) {
    return this.afs.update(`places/${placeId}`, {isTyping: content});
  }

  public getisTyping(placeId: string) {
    return this.afs.docWithId$(`places/${placeId}`)
    .pipe(
      map((place) => place.isTyping)
    );
  }

  public sendMessage(placeId: string, messge: AppMessage) {
    return this.afs.add(`places/${placeId}/messages`, messge);
  }
}
