import { Observable, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserProfile } from '../models/user.model';
import { AuthService } from './auth.service';
import { User } from 'firebase';
import { switchMap, tap } from 'rxjs/operators';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public currentuser$ = new BehaviorSubject(null);

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
}
