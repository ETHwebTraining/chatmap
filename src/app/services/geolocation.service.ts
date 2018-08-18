import { switchMap, shareReplay, filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CurrentLocation } from '../models/user.model';
import { Observable, of, throwError } from 'rxjs';

import * as firebase from 'firebase/app';
import * as geofirex from 'geofirex';


@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  public currentLocation$: Observable<CurrentLocation>;
  public places$: Observable<any>;

  private geo = geofirex.init(firebase);
  private locations = this.geo.collection('places');

  constructor() {
    this.currentLocation$ = this.getCurrentLocation();
  }


  public getLocations(radius?: number, cntr?: CurrentLocation) {
    return this.currentLocation$.pipe(
      filter((res) => !!res),
      switchMap((loc) => {
        const center = !!cntr ? this.geo.point(cntr.lat, cntr.lng) : this.geo.point(loc.lat, loc.lng);
        const rad = radius || 0.5;
        const field = 'pos';
        return this.locations.within(center, rad, field);
      })
    );
  }




  private getCurrentLocation() {
   return of('geolocation' in navigator)
    .pipe(
        switchMap((val) => {
            if (!val) { return throwError('Your browser does not support geolocation'); }
            return of(val);
        }),
        switchMap(() => this.getCurrentPosition()),
        shareReplay(1)
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
