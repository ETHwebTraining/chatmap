import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { AddPlaceComponent } from './components/add-place/add-place.component';

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule
  ],
  declarations: [ProfileComponent, UserDetailsComponent, AddPlaceComponent]
})
export class ProfileModule { }
