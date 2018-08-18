import { tap, map, switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'chatMap';
  public navOpened = false;
  public navItems$: Observable<{icon: string, name: string}[]>;


  constructor(
    private auth: AuthService,
    private router: Router
  ) {

  }

  ngOnInit() {
   this.navItems$ = this.auth.user$.pipe(
    switchMap((user) => !!user ? this.setAuthOptions() : this.setNotAuthOptions())
    );
  }

  public onNavigate(name: string) {
    this.router.navigate([`/${name.toLowerCase()}`]);
    this.navOpened = false;
  }


  private setAuthOptions() {
    this.router.navigate(['/profile']);
   return of ([
      {icon: 'person', name: 'Profile'},
      {icon: 'map', name: 'Map'},
      {icon: 'settings', name: 'settings'}
    ]);
  }


  private setNotAuthOptions() {
    this.router.navigate(['/auth']);
    return of ([
      {icon: 'input', name: 'auth'},
    ]);
  }
}
