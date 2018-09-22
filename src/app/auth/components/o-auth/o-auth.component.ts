import { Component, OnInit } from '@angular/core';

import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-o-auth',
  templateUrl: './o-auth.component.html',
  styleUrls: ['./o-auth.component.scss']
})
export class OAuthComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  public googlelogin() {
    this.auth.googleLogin()
    .pipe(
      take(1)
    ).subscribe((msg) => this.router.navigate(['/profile']));
  }

}
