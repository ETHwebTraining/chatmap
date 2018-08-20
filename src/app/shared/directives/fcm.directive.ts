import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap, filter, tap, catchError, map } from 'rxjs/operators';
import { Directive, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable, of, merge } from 'rxjs';
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
    private afs: FirestoreService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    /*
    checking the current users auth status, then if authenticated
    requesting permission to recieve an fcm token
    */

    const token$ = this.auth.user$.pipe(
      filter((res) => !!res),
      tap((user) => this.userId = user.uid),
      switchMap(() => this.getPermission()),
      switchMap(() => this.monitorRefresh()),
      catchError(() => of(null))
    );

    /*
      stream that listens for new notifications from fcm
      when the app is in the foreground
    */
    const notif$ = this.onNotification()
    .pipe(
      map((payload: any) => payload.notification.body),
      tap((msg) => this.snackBar.open(msg, '', {duration: 3000, verticalPosition: 'top'}))
    );

    this.sub = merge(token$, notif$).subscribe();
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

  private onNotification() {
    return new Observable((obs) => {
      this.messaging.onMessage(
        (payload) => obs.next(payload),
        (err) => obs.error(err)
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
