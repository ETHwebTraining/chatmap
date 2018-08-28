import { environment } from './../../environments/environment';
import { switchMap, shareReplay, filter, map, catchError, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CurrentLocation, Place } from '../models/user.model';
import { Observable, of, throwError } from 'rxjs';

import * as firebase from 'firebase/app';
import * as geofirex from 'geofirex';
import { HttpParams, HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { FirestoreService } from './firestore.service';


@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  // refrence to the observabe that holds the users location
  public currentLocation$: Observable<CurrentLocation>;

  // refrence to the observable of the users places
  public places$: Observable<any>;

  // initializing geofirex
  private geo = geofirex.init(firebase);

  // refrence to the collection to be used to store places for geoquerying
  private locations = this.geo.collection('places');

  constructor(
    private http: HttpClient,
    private current: UserService,
    private afs: FirestoreService
  ) {
    this.currentLocation$ = this.getCurrentLocation(); // initializing the current location
  }


  // querys the places collection for places around a given center and radius
  // if no center or radius is given it defauts to the users location and 50
  public getLocations(radius?: number, cntr?: CurrentLocation) {
    return this.currentLocation$.pipe(
      filter((res) => !!res),
      switchMap((loc) => {
        const center = !!cntr ? this.geo.point(cntr.lat, cntr.lng) : this.geo.point(loc.lat, loc.lng);
        const rad = radius || 50;
        const field = 'pos';
        return this.locations.within(center, rad, field);
      })
    );
  }

  // adds a place to the places collection in the db, with some data for geoquerying
  public addPlace(place: Place) {
    const offset = Math.random() / 100; // adding a rondom offset to spread locations apart a bit
    const point = this.geo.point(place.loc.lat + offset, place.loc.lng + offset);

    return this.locations.add({ ...place, pos: point.data });
  }


  public editPlace(place: Place) {
    const newPlace = {...place};
    delete newPlace.id;
    console.log('editing  at ', place.id, newPlace );
    return this.afs.update(`places/${place.id}`, newPlace);
  }

  public deletePlace(place: Place) {
    return this.afs.deleteDoc(`places/${place.id}`);
  }

  /*
   allows a user to discover a place by adding info like the user and place id
   under a discoveries collection in the db if the place in question is one that
   the user created then it dies nothin
  */

  public discovePlace(place: Place) {
    this.current.currentuser$.pipe(
      filter(res => !!res),
      map((usr) => usr.id),
      switchMap((id) => {

        if (place.userId === id) { return of(null); }

        return this.afs.upsertNull(`discoveries/${id}_${place.id}`, { placeId: place.id, userId: id });
      }),
      take(1),
    ).subscribe();
  }

  /*
  makes a request to the google maps api for geocoding based on an address
  then returns the results in useful format
  */
  public searchAddress(address: string) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json`;
    let params = new HttpParams();
    params = params.set('address', address);
    params = params.set('key', environment.googleMapsKey.apiKey);
    return this.http.get(url, { params: params })
      .pipe(
        map((res: { results: any[] }) => this.mapResults(res.results)),
        catchError(() => of([]))
      );
  }

  // maps the return value from the googlemaps api into the location
  // address and coordinates
  private mapResults(res: any[]) {
    console.log(' the results ', res);
    return res.map(val => {
      return {
        address: val.formatted_address,
        location: { ...val.geometry.location }
      };
    });
  }

  /*
  validate that the users browser supports geolocaiton
  then call a function that gets the current position
  */
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


  /*
  wraps the web geolocation api into an observable that emits the
  current users position
  */
  private getCurrentPosition(): Observable<CurrentLocation> {
    return new Observable((obs) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => { obs.next(this.processPosition(pos)); },
        (err) => { obs.error(err); },
      );
    });
  }

  // maps the full positoin object returned from the geolocation api to a useful format
  private processPosition(pos: Position): CurrentLocation {
    return {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    };
  }
}
