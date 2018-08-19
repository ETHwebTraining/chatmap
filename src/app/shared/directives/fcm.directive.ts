import { switchMap, filter, tap, catchError } from 'rxjs/operators';
import { Directive, OnInit, OnDestroy } from '@angular/core';
import { Subscription,  Observable, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';

import * as firebase from 'firebase';
import { FirestoreService } from '../../services/firestore.service';

@Directive({
  selector: '[appFcm]'
})
export class FcmDirective implements OnInit, OnDestroy {


  private sub: Subscription;
  private messageing = firebase.messaging();
  private userId: string;

  constructor(
    private auth: AuthService,
    private afs: FirestoreService
  ) { }

  ngOnInit() {
    this.sub = this.auth.user$.pipe(
      filter((res) => !! res),
      tap((user) => this.userId = user.uid),
      switchMap(() => this.getPermission()),
      switchMap(() => this.monitorRefresh()),
      catchError(() => of(null))
    ).subscribe();
  }



  private async getPermission() {
    await this.messageing.requestPermission();
    const token = await this.messageing.getToken();
    return this.saveToken(token);
  }

  private monitorRefresh() {
    return new Observable((obs) => {
      this.messageing.onTokenRefresh(async () => {

        const token = await this.messageing.getToken();
        this.saveToken(token);
        obs.next();

     }, (e) => obs.error(e)
    );
    });
  }


  private saveToken(token: string) {
    return this.afs.upsertNull(`devices/${token}`, {userId: this.userId, token: token});
  }


  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
