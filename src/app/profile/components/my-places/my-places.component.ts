import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Place, UserProfile } from '../../../models/user.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { take, filter } from 'rxjs/operators';
import { AddPlaceModalComponent } from '../add-place-modal/add-place-modal.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-my-places',
  templateUrl: './my-places.component.html',
  styleUrls: ['./my-places.component.scss']
})
export class MyPlacesComponent implements OnInit {

  @Input() places: Place[];
  @Input() user: UserProfile;

  @Output() edit = new EventEmitter<Place>();
  @Output() delete = new EventEmitter<Place>();

  constructor(
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

 public onToChat(place: Place) {
    this.router.navigate(['/chat'], {queryParams: {placeId: place.id, placeName: place.name}});
  }

  public onEdit(place: Place) {
    const dialogref = this.dialog.open(AddPlaceModalComponent, {
      width: '300px',
      height: '400px',
      data: {place: place, user: this.user}
    });

    dialogref.afterClosed()
      .pipe(
        take(1),
        filter((res) => !!res)
      )
      .subscribe(data => this.edit.emit(data));
  }


  public onDelete(place: Place) {
    const dialogref = this.dialog.open(ConfirmModalComponent, {
      // width: '300px',
      data: `You are about to delete ${place.name}`
    });
console.log('opening confirm ');
    dialogref.afterClosed()
      .pipe(
        take(1),
        filter((res) => !!res)
      )
      .subscribe(data => this.delete.emit(place));
  }

}
