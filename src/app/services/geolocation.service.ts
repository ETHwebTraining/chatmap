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

  public currentLocation$: Observable<CurrentLocation>;
  public places$: Observable<any>;

  private geo = geofirex.init(firebase);
  private locations = this.geo.collection('places');

  constructor(
    private http: HttpClient,
    private current: UserService,
    private afs: FirestoreService
  ) {
    this.currentLocation$ = this.getCurrentLocation();
  }


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

  public addPlace(place: Place) {
    const offset = Math.random() / 100;
    const point = this.geo.point(place.loc.lat + offset, place.loc.lng + offset);

   return  this.locations.add({...place, pos: point.data});
  }

  public discovePlace(place: Place) {
    this.current.currentuser$.pipe(
      filter(res => !!res),
      map((usr) => usr.id),
      switchMap((id) => {

        if (place.userId === id) {return of(null); }

       return  this.afs.upsertNull(`discoveries/${id}_${place.id}`, {placeId: place.id, userId: id});
      }),
      take(1),
    ).subscribe();
  }

  public searchAddress(address: string) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json`;
    let params = new HttpParams();
    params = params.set('address', address);
    params = params.set('key', environment.googleMapsKey.apiKey);
    return this.http.get(url, {params: params})
    .pipe(
      map((res: {results: any[]}) => this.mapResults(res.results)),
      catchError(() => of([]))
    );
  }


  private mapResults(res: any []) {
    console.log(' the results ', res);
    return res.map( val => {
      return {
        address: val.formatted_address,
        location: {...val.geometry.location }
      };
    });
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
