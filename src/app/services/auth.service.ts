import { FirestoreService } from './firestore.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'firebase';
import { Observable,  of, from, throwError } from 'rxjs';
import { catchError, map, tap, shareReplay } from 'rxjs/operators';
import { UserProfile } from '../models/user.model';

import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user$: Observable<User>;

  constructor(
    private afs: FirestoreService,
    private afAuth: AngularFireAuth
  ) {

    this.user$ = this.afAuth.authState.pipe(shareReplay(1));
  }


  public  signInWithEmailPassword(email: string, password: string) {
    return from(this.afAuth.auth.signInWithEmailAndPassword(email, password))
    .pipe(
      tap((usr) => this.updateUserData(usr.user)),
      map(() => 'Sign in Success'),
      catchError(() => throwError('Sign in failed'))
    );
  }

  public  signUpWithEmailPassword(email: string, password: string) {
    return from(this.afAuth.auth.createUserWithEmailAndPassword(email, password))
    .pipe(
      tap((usr) => this.updateUserData(usr.user)),
      map(() => 'Sign in Success'),
      catchError((err) => throwError(err.message))
    );
  }

  public googleLogin() {
    const proviider = new firebase.auth.GoogleAuthProvider();
   return from (this.afAuth.auth.signInWithPopup(proviider))
   .pipe(
    tap((usr) => this.updateUserData(usr.user)),
    map(() => 'Sign in Success'),
    catchError((err) => throwError(err.message))
  );
  }

  private updateUserData(usr: User) {
    const user: UserProfile = {
      displayName: usr.displayName || 'New user',
      email: usr.email || 'None',
      photoURL: usr.photoURL || '',
      placesDiscovered: 0,
      placesLiked: 0
    };

    return this.afs.upsertNull(`users/${usr.uid}`, user);
  }





  public logOut() {
    this.afAuth.auth.signOut();
  }


}
