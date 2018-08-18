import { debounceTime, distinctUntilChanged, switchMap, filter, tap } from 'rxjs/operators';
import { CurrentLocation, UserProfile, Place } from './../../../models/user.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { GeolocationService } from '../../../services/geolocation.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-add-place-modal',
  templateUrl: './add-place-modal.component.html',
  styleUrls: ['./add-place-modal.component.scss']
})
export class AddPlaceModalComponent implements OnInit {

  public name = '';
  public address: FormControl;
  public hits$: Observable<any[]>;

  private chosenAddy: { address: string, location: CurrentLocation };

  constructor(
    public dialogRef: MatDialogRef<AddPlaceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserProfile,
    private fb: FormBuilder,
    private geo: GeolocationService
  ) { }

  ngOnInit() {
    this.address = this.fb.control('', [Validators.required]);
    this.hits$ = this.searchAddy();
  }

  private searchAddy() {
    return this.address.valueChanges
      .pipe(
        filter((val) => val.length > 2),
        debounceTime(800),
        distinctUntilChanged(),
        switchMap((addy) => this.geo.searchAddress(addy)),
        tap((val) => console.log('the results ', val))
      );
  }


  public onChooseAddy(hit) {
    this.chosenAddy = hit;
    this.address.setValue(hit.address);
  }

  public onCancel() {
    this.dialogRef.close();
  }

  public onProceed() {
    const place: Place = {
      name: this.name,
      userId: this.data.id,
      loc: this.chosenAddy.location
    };
    this.dialogRef.close(place);
  }

}
