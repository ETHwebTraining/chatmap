import { tap, switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    public navOpened = false; // value used to determine the state of the side nav

    constructor(
        public auth: AuthService,
        private router: Router,
        private current: UserService
    ) {

    }

    ngOnInit() {
        /*
            monitoring the authentication state of the currnet user
            if the state is null then rout the the auth mosdule
        */

        this.auth.user$.pipe(
            switchMap((user) => this.current.getCurrentUser(user)),
            tap((user) => { if (!user) { this.router.navigate(['/auth']); } })
        ).subscribe();


    }


}
