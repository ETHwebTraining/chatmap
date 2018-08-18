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
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { NavComponent } from './components/nav/nav.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    AngularFirestoreModule,
    AgmCoreModule.forRoot(environment.googleMapsKey),
    AngularFireAuthModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  exports: [
    AngularFirestoreModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    AgmCoreModule,
    FormsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatInputModule,
    NavComponent,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  declarations: [
    NavComponent
  ]
})
export class SharedModule { }
