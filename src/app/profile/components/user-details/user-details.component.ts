import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserProfile } from '../../../models/user.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  public user$: Observable<UserProfile>;

  constructor(
    public current: UserService
  ) { }

  ngOnInit() {
    this.user$ = this.current.getCurrentUser()
    .pipe(
      switchMap(() => this.current.currentuser$.asObservable())
    );
  }

}
