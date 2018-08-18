import { Observable } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserProfile } from '../../../models/user.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  @Input() user: UserProfile;

  constructor() { }

  ngOnInit() {
  }

}
