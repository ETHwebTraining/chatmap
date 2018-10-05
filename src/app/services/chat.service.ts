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

  // gets all the messages associated with a given place
  public getMessages(placeId: string) {
    return this.afs.colWithIds$(`places/${placeId}/messages`, ref => ref.orderBy('createdAt', 'asc'));
  }

  // updates the is typing property for the given place
  public updateIsTyping(placeId: string, content: string) {
    return this.afs.update(`places/${placeId}`, { isTyping: content });
  }

  // checks to see if a document that represents that the current user has liked a
  // given place exists
  public getIsLiked(placeId: string) {
    return this.current.currentuser$.pipe(
      filter((res) => !!res),
      switchMap((user) => this.afs.doc$(`likes/${user.id}_${placeId}`))
    );
  }


  public getisTyping(placeId: string) {
    return this.afs.docWithId$(`places/${placeId}`)
      .pipe(
        map((place) => place.isTyping)
      );
  }

  // adds a document that represents the user has liked the given place
  public likePlace(placeId: string) {
    const like: PlaceLike = { userId: this.current.currentuser$.value.id, placeId: placeId };
    const id = this.getLikeId(like.userId, like.placeId);
    return this.afs.addDocAt(`likes`, id, like);
  }

  // deletes the like document for a given place
  public unLikePlace(placeId: string) {
    const id = this.getLikeId(this.current.currentuser$.value.id, placeId);
    return this.afs.deleteDoc(`likes/${id}`);
  }

  // sends message to the given place
  public sendMessage(placeId: string, messge: AppMessage) {
    return this.afs.add(`places/${placeId}/messages`, messge);
  }

  private getLikeId(a: string, b: string) {
    return `${a}_${b}`;
  }
}
