import { tap, map, switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public navOpened = false;

  constructor(
    public auth: AuthService,
    private router: Router,
    private current: UserService
  ) {

  }

  ngOnInit() {
    this.auth.user$.pipe(
      switchMap((user) => this.current.getCurrentUser(user)),
      tap((user) =>  {if (!user) {this.router.navigate(['/auth']); } })
    ).subscribe();
  }


}
