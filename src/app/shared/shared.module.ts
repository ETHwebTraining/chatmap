import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { environment } from '../../environments/environment';

// angular fire 2 firestore dependency
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

// google maps library
import { AgmCoreModule } from '@agm/core';

// angular flex area
import {FlexLayoutModule} from '@angular/flex-layout';

// angular material dependencies
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';

import { NavComponent } from './components/nav/nav.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AngularFirestoreModule,
    AgmCoreModule.forRoot(environment.googleMapsKey),
    AngularFireAuthModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule
  ],
  exports: [
    AngularFirestoreModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    AgmCoreModule,
    FlexLayoutModule,
    MatInputModule,
    NavComponent,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule
  ],
  declarations: [
    NavComponent
  ]
})
export class SharedModule { }
