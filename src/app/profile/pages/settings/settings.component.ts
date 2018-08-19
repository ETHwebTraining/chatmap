import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { filter, withLatestFrom, switchMap, take } from 'rxjs/operators';
import { UserProfile } from '../../../models/user.model';
import { of } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {


  public displayname: FormControl;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public auth: AuthService,
    private current: UserService
  ) { }

  ngOnInit() {
    this.initForm();

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


  private initForm() {
    this.current.currentuser$.pipe(
      filter(res => !!res),
      take(1)
    ).subscribe((user) =>  this.displayname = user ? this.fb.control(user.displayName) : this.fb.control('') );
  }

  private updateUser() {
    const newUser: UserProfile = { ...this.current.currentuser$.value, displayName: this.displayname.value };
    return this.current.updateCurrentUser(newUser);
  }

  private getNavStart() {
    return this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    );
  }

}
