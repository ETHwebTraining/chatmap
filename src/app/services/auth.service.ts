import { Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user$: Observable<User>;

  constructor(
    private afs: FirestoreService,
    private afAuth: AngularFireAuth
  ) {

    this.user$ = this.afAuth.authState;
  }





}
