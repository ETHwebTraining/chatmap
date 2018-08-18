import { Observable, from } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserProfile, Place } from '../../../models/user.model';
import { switchMap, map, tap, catchError, take } from 'rxjs/operators';
import { GeolocationService } from '../../../services/geolocation.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user$: Observable<UserProfile>;

  constructor(
    public current: UserService,
    private geo: GeolocationService,
    public snackBar: MatSnackBar
  ) {
    console.log('profile component active');
  }

  ngOnInit() {

    this.user$ = this.current.getCurrentUser()
    .pipe(
      switchMap(() => this.current.currentuser$.asObservable())
    );
  }


  public onAddPlace(place: Place) {
   from(this.geo.addPlace(place))
   .pipe(
     take(1),
   ).subscribe(
     () => this.showMessage('Place added sucessfully'),
     () => this.showMessage('Failed to add place')
   );
  }

  private showMessage(msg: string) {
    this.snackBar.open(msg, '', {duration: 3000});
  }

}
