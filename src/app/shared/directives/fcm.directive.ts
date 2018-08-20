import { switchMap, filter, tap, catchError } from 'rxjs/operators';
import { Directive, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';

import * as firebase from 'firebase';
import { FirestoreService } from '../../services/firestore.service';

@Directive({
  selector: '[appFcm]'
})
export class FcmDirective implements OnInit, OnDestroy {


  private sub: Subscription; // used to keep track of the subscription
  private messaging = firebase.messaging(); // getting a refrence to firebase messaging
  private userId: string;

  constructor(
    private auth: AuthService,
    private afs: FirestoreService
  ) { }

  ngOnInit() {
    /*
    checking the current users auth status, then if authenticated
    requesting permission to recieve an fcm token
    */
    this.sub = this.auth.user$.pipe(
      filter((res) => !!res),
      tap((user) => this.userId = user.uid),
      switchMap(() => this.getPermission()),
      switchMap(() => this.monitorRefresh()),
      catchError(() => of(null))
    ).subscribe();

   this.messaging.onMessage(function(payload) {
      console.log('Message received. ', payload);
      // ...
    });


  }



  // requests permission for a token, then saves it to the db
  private async getPermission() {
    await this.messaging.requestPermission();
    const token = await this.messaging.getToken();
    return this.saveToken(token);
  }


// listens for whenever the token changes then saves it to the db
  private monitorRefresh() {
    return new Observable((obs) => {
      this.messaging.onTokenRefresh(async () => {

        const token = await this.messaging.getToken();
        this.saveToken(token);
        obs.next();

      }, (e) => obs.error(e)
      );
    });
  }

// saves the token with its value as the key under the devices collection
  private saveToken(token: string) {
    return this.afs.upsertNull(`devices/${token}`, { userId: this.userId, token: token });
  }


  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
