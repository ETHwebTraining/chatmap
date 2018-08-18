import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { EmailPasswordComponent } from './components/email-password/email-password.component';
import { SharedModule } from '../shared/shared.module';
import { OAuthComponent } from './o-auth/o-auth.component';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ],
  declarations: [
    LoginComponent,
    EmailPasswordComponent,
    OAuthComponent
  ]
})
export class AuthModule { }
