import { BehaviorSubject, of, combineLatest } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserProfile, PlaceLike } from '../models/user.model';
import { AuthService } from './auth.service';
import { switchMap, tap, filter, map, startWith } from 'rxjs/operators';
import { FirestoreService } from './firestore.service';
import { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public currentuser$ = new BehaviorSubject<UserProfile>(null);

  constructor(
    private auth: AuthService,
    private afs: FirestoreService
  ) {

   }

   /*
    recieves a firebase user or null, if user then fetches the data for that user from the db
    then updates the currentuser$ accordingly, if null then updates currentUser$ with null
   */
   public getCurrentUser(user: User) {
    if (user) {
      return this.afs.docWithId$(`users/${user.uid}`)
      .pipe(
        tap((usr) => this.currentuser$.next(usr))
      );
    }
    return of(null)
    .pipe(
      tap((usr) => this.currentuser$.next(usr))
    );

   }


// combines the places returned from the created and liked streams
// then filters them for uniqueness
   public getMyPlaces() {
    return combineLatest(this.getCreatedPlaces(), this.getLikedPlaces())
    .pipe(
      map(([cre, lik]) => this.filterRepeats(cre, lik)),
      tap((places) => console.log('the places ', places))
    );
   }

   // used to update the current user
   public updateCurrentUser(user: UserProfile) {
     this.currentuser$.next(user);
     const newUser = {...user};
     delete newUser.id;
     return this.afs.update(`users/${user.id}`, newUser);
   }


// makes sure that the same value does not appear in both arrays
  private filterRepeats(cre: any[], lik: any[]) {
    const creIds = cre.map(places => places.id);
    const newLikes = lik.filter(like => creIds.indexOf(like.id) < 0);
    return cre.concat(newLikes);
  }

/*
  querys the db for all documents that represent that the user has liked a place, then maps them to
  the place documents that then represent
*/
   private getLikedPlaces() {
    return this.afs.colWithIds$('likes', ref => ref.where('userId', '==', this.currentuser$.value.id))
    .pipe(
      map((likes: PlaceLike []) => likes.map(like => like.placeId)),
      switchMap((ids) => combineLatest(
        ids.map(id => this.getPlace(id))
      )),
      startWith([])
    );
   }

   /*
  querys the db for all documents that represent that the user has creted a place, then maps them to
  the place documents that then represent
*/

   private getCreatedPlaces() {
    return this.afs.colWithIds$('places', ref => ref.where('userId', '==', this.currentuser$.value.id))
    .pipe(
      filter(res => !!res),
      startWith([])
    );
   }

   // given the document id of a place, retuns the data of that document
   private getPlace(placeId: string) {
    return this.afs.docWithId$(`places/${placeId}`)
    .pipe(
      filter(res => !!res),
    );
   }
}
