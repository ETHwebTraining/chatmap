import { take, filter } from 'rxjs/operators';
import {  Place } from './../../../models/user.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserProfile } from '../../../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { AddPlaceModalComponent } from '../add-place-modal/add-place-modal.component';

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.scss']
})
export class AddPlaceComponent implements OnInit {

  @Input() user: UserProfile;
  @Output() newLoc = new EventEmitter<Place>();

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }


  public openDailog() {
    const dialogref = this.dialog.open(AddPlaceModalComponent, {
      width: '300px',
      height: '400px',
      data: {user: this.user}
    });

    dialogref.afterClosed()
      .pipe(
        take(1),
        filter((res) => !!res)
      )
      .subscribe(data => this.newLoc.emit(data));
  }

}
