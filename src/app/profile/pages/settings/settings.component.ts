import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { filter, switchMap, take } from 'rxjs/operators';
import { UserProfile } from '../../../models/user.model';
import { of } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {


  // refrence to the form controle for the users displayname
  public displayname: FormControl;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public auth: AuthService,
    private current: UserService
  ) { }

  ngOnInit() {
    // initialize the form
    this.initForm();

    /*
      Listen for a navigation start event then switch to the user auth observable
      if the user is still defined update his value
      if not then do nothing
    */
    this.getNavStart()
      .pipe(
        switchMap(() => this.auth.user$),
        switchMap((user) => {
          if (!user) { return of(null); }
          return this.updateUser();
        }),
        take(1)
      ).subscribe();
  }

  /*
  initailizes the form with data from the current user stream
  if the user data is defined, initialize the formcontrol with his displayname
  if not then use the empty string

  */
  private initForm() {
    this.current.currentuser$.pipe(
      filter(res => !!res),
      take(1)
    ).subscribe((user) => this.displayname = user ? this.fb.control(user.displayName) : this.fb.control(''));
  }

  // saves updates the current user in the db
  private updateUser() {
    const newUser: UserProfile = { ...this.current.currentuser$.value, displayName: this.displayname.value };
    return this.current.updateCurrentUser(newUser);
  }

  // returns an observable of navigation start
  private getNavStart() {
    return this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    );
  }

}
