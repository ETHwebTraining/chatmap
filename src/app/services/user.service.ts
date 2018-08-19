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

   public getMyPlaces() {
    return combineLatest(this.getCreatedPlaces(), this.getLikedPlaces())
    .pipe(
      map(([cre, lik]) => this.filterRepeats(cre, lik))
    );
   }

   public updateCurrentUser(user: UserProfile) {
     this.currentuser$.next(user);
     const newUser = {...user};
     delete newUser.id;
     return this.afs.update(`users/${user.id}`, newUser);
   }



  private filterRepeats(cre: any[], lik: any[]) {
    const creIds = cre.map(places => places.id);
    const newLikes = lik.filter(like => creIds.indexOf(like.id) < 0);
    return cre.concat(newLikes);
  }

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

   private getCreatedPlaces() {
    return this.afs.colWithIds$('places', ref => ref.where('userId', '==', this.currentuser$.value.id))
    .pipe(
      filter(res => !!res),
      startWith([])
    );
   }

   private getPlace(placeId: string) {
    return this.afs.docWithId$(`places/${placeId}`)
    .pipe(
      filter(res => !!res),
    );
   }
}
