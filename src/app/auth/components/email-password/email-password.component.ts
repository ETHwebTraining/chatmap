import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-email-password',
  templateUrl: './email-password.component.html',
  styleUrls: ['./email-password.component.scss']
})
export class EmailPasswordComponent implements OnInit {


  public form: FormGroup;


  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  public login() {
    this.auth.signInWithEmailPassword(this.email.value, this.password.value)
    .pipe(
      take(1)
    )
    .subscribe((msg) => console.log('the message ', msg));
  }

  public signUp() {
    this.auth.signUpWithEmailPassword(this.email.value, this.password.value)
    .pipe(
      take(1)
    )
    .subscribe((msg) => console.log('the message ', msg));
  }

  public get email() {
    return this.form.get('email');
  }

  public get password() {
    return this.form.get('password');
  }


}
