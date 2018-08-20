import { Observable, from } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserProfile, Place } from '../../../models/user.model';
import { switchMap, take, filter, tap } from 'rxjs/operators';
import { GeolocationService } from '../../../services/geolocation.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user$: Observable<UserProfile>;
  public myPlaces$: Observable<Place[]>;

  constructor(
    public current: UserService,
    private geo: GeolocationService,
    public snackBar: MatSnackBar
  ) {
    console.log('profile component active');
  }

  ngOnInit() {

    // initilizing the user$ with the user from the service
    this.user$ =  this.current.currentuser$.asObservable();

    // initializing the myPlaces$ with the places from the service
    this.myPlaces$ = this.current.currentuser$.pipe(
      filter((res) => !!res),
      switchMap(() => this.current.getMyPlaces()),
    );
  }


  // event handle for when a new place has been created
  // saves the place to the db using the service
  // then shows the user some feedback
  public onAddPlace(place: Place) {
   from(this.geo.addPlace(place))
   .pipe(
     take(1),
   ).subscribe(
     () => this.showMessage('Place added sucessfully'),
     () => this.showMessage('Failed to add place')
   );
  }

// displays a given message using the snackbar service
  private showMessage(msg: string) {
    this.snackBar.open(msg, '', {duration: 3000});
  }

}
