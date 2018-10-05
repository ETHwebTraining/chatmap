import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './pages/map/map.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MapRoutingModule,
    SharedModule
  ],
  declarations: [MapComponent]
})
export class MapModule { }
