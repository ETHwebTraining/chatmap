import { ProfileRoutingModule } from './profile-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './pages/profile/profile.component';
import { AddPlaceComponent } from './components/add-place/add-place.component';
import { AddPlaceModalComponent } from './components/add-place-modal/add-place-modal.component';
import { MyPlacesComponent } from './components/my-places/my-places.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule
  ],
  declarations: [
    ProfileComponent,
    AddPlaceComponent,
    AddPlaceModalComponent,
    MyPlacesComponent,
    UserDetailsComponent,
    SettingsComponent
  ]
})
export class ProfileModule { }
