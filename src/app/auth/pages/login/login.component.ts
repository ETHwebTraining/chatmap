import { Component, OnInit } from '@angular/core';
import { GeolocationService } from '../../../services/geolocation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private geo: GeolocationService) { }

  ngOnInit() {
    this.geo.currentLocation$.subscribe((loc) => console.log('the location ', loc));
  }

}
