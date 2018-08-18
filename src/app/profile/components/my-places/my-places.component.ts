import { Component, OnInit, Input } from '@angular/core';
import { Place } from '../../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-places',
  templateUrl: './my-places.component.html',
  styleUrls: ['./my-places.component.scss']
})
export class MyPlacesComponent implements OnInit {

  @Input() places: Place[];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onToChat(place: Place) {
    this.router.navigate(['/chat'], {queryParams: {placeId: place.id, placeName: place.name}});
  }

}
