import { CurrentLocation, Place } from './../../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { GeolocationService } from '../../../services/geolocation.service';
import { BehaviorSubject, Observable, combineLatest, pipe } from 'rxjs';
import { switchMap, tap, throttleTime, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  public radius = new BehaviorSubject<number>(50);
  public center = new BehaviorSubject<CurrentLocation>(null);

  public places$: Observable<any[]>;

  constructor(
    public geo: GeolocationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.places$ = combineLatest(this.getRad(), this.getCenter()).pipe(
      switchMap(([rad, center]) => this.geo.getLocations(rad, center)),
      tap((placs) => console.log('the places', placs))
    );
  }

  public updateRad(rad: number) {
   this.radius.next(rad * 50);
  }

  public updateCenter(center: CurrentLocation) {
    this.center.next(center);
  }
  public toChat(place: Place) {
    this.router.navigate(['/chat'], {queryParams: {placeId: place.id, placeName: place.name}});
    console.log('going to chat');
  }


  private getCenter() {
    return this.center.pipe(
      throttleTime(400)
    );
  }

  private getRad() {
    return this.radius.pipe(
      debounceTime(1000),
      // distinctUntilChanged()
    );
  }

}
