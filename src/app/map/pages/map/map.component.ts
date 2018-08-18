import { Component, OnInit } from '@angular/core';
import { GeolocationService } from '../../../services/geolocation.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {



  constructor(
    public geo: GeolocationService
  ) { }

  ngOnInit() {
  }

}
