import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { AddPlaceComponent } from './components/add-place/add-place.component';
import { AddPlaceModalComponent } from './components/add-place-modal/add-place-modal.component';
import { MyPlacesComponent } from './components/my-places/my-places.component';
import { SettingsComponent } from './pages/settings/settings.component';

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule
  ],
  declarations: [
    ProfileComponent,
    UserDetailsComponent,
    AddPlaceComponent,
    AddPlaceModalComponent,
    MyPlacesComponent,
    SettingsComponent,
    // ConfirmModalComponent
  ],
  entryComponents: [
    AddPlaceModalComponent,
    // ConfirmModalComponent
  ]
})
export class ProfileModule { }
