import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { AppMessage, PlaceLike } from '../models/user.model';
import { map, switchMap, filter } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private afs: FirestoreService,
    private current: UserService
  ) { }

  public getMessages(placeId: string) {
    return this.afs.colWithIds$(`places/${placeId}/messages`, ref => ref.orderBy('createdAt', 'asc'));
  }

  public updateIsTyping(placeId: string, content: string) {
    return this.afs.update(`places/${placeId}`, {isTyping: content});
  }

  public getIsLiked(placeId: string) {
    return this.current.currentuser$.pipe(
      filter((res) => !!res),
      switchMap((user) => this.afs.doc$(`likes/${user.id}_${placeId}`))
    ) ;
  }

  public getisTyping(placeId: string) {
    return this.afs.docWithId$(`places/${placeId}`)
    .pipe(
      map((place) => place.isTyping)
    );
  }

  public likePlace(placeId: string) {
    const like: PlaceLike = {userId: this.current.currentuser$.value.id, placeId: placeId  };
    const id = this.getLikeId(like.userId, like.placeId);
    return this.afs.addDocAt(`likes`, id, like);
  }

  public  unLikePlace(placeId: string) {
    const id = this.getLikeId(this.current.currentuser$.value.id, placeId);
    return this.afs.deleteDoc(`likes/${id}`);
  }

  public sendMessage(placeId: string, messge: AppMessage) {
    return this.afs.add(`places/${placeId}/messages`, messge);
  }

  private getLikeId(a: string, b: string) {
      return `${a}_${b}`;
  }
}
