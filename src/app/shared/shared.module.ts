import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { environment } from '../../environments/environment';

import { AngularFirestoreModule } from 'angularfire2/firestore'; // angular fire 2 firestore dependency
import { AgmCoreModule } from '@agm/core'; // google maps library
import { AngularFireAuthModule } from 'angularfire2/auth';

@NgModule({
  imports: [
    CommonModule,
    AngularFirestoreModule,
    AgmCoreModule.forRoot(environment.googleMapsKey),
    AngularFireAuthModule,
  ],
  exports: [
    AngularFirestoreModule,
    AngularFireAuthModule,
    AgmCoreModule,
  ],
  declarations: []
})
export class SharedModule { }
