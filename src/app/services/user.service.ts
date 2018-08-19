import { Observable, BehaviorSubject, of, forkJoin, combineLatest } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserProfile, PlaceLike } from '../models/user.model';
import { AuthService } from './auth.service';
import { User } from 'firebase';
import { switchMap, tap, filter, take, map, startWith } from 'rxjs/operators';
import { FirestoreService } from './firestore.service';

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

   public getCurrentUser() {
    return this.auth.user$.pipe(
      switchMap((usr) => !!usr ? this.afs.docWithId$(`users/${usr.uid}`) : of(null)),
      tap((usr) => this.currentuser$.next(usr))
    );
   }

   public getMyPlaces() {
    return combineLatest(this.getCreatedPlaces(), this.getLikedPlaces())
    .pipe(
      map(([cre, lik]) => this.filterRepeats(cre, lik))
    );
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
      switchMap((ids) => forkJoin(
        ids.map(id => this.getPlace(id))
      )),
      startWith([])
    );
   }

   private getCreatedPlaces() {
    return this.afs.colWithIds$('places', ref => ref.where('userId', '==', this.currentuser$.value.id))
    .pipe(
      filter(res => !!res),
      take(1),
      startWith([])
    );
   }

   private getPlace(placeId: string) {
    return this.afs.docWithId$(`places/${placeId}`)
    .pipe(
      filter(res => !!res),
      take(1)
    );
   }
}
