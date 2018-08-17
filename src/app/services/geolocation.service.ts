import { switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CurrentLocation } from '../models/user.model';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  public currentLocation$: Observable<CurrentLocation>;

  constructor() {
    this.currentLocation$ = this.getCurrentLocation();
  }

  private getCurrentLocation() {
   return of('geolocation' in navigator)
    .pipe(
        switchMap((val) => {
            if (!val) { return throwError('Your browser does not support geolocation'); }
            return of(val);
        }),
        switchMap(() => this.getCurrentPosition())
    );
  }



  private getCurrentPosition(): Observable<CurrentLocation> {
   return new Observable ((obs) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => { obs.next(this.processPosition(pos)); },
          (err) => {  obs.error(err); },
        );
    });
  }

  private processPosition(pos: Position): CurrentLocation {
    return {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    };
  }
}
