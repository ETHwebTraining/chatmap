import { debounceTime, distinctUntilChanged, switchMap, filter, tap } from 'rxjs/operators';
import { CurrentLocation } from './../../../models/user.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { GeolocationService } from '../../../services/geolocation.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-place-modal',
  templateUrl: './add-place-modal.component.html',
  styleUrls: ['./add-place-modal.component.scss']
})
export class AddPlaceModalComponent implements OnInit {


  public form: FormGroup;
  public hits$: Observable<any[]>;

  public useCurrentLocation = true;

  private chosenAddy: { address: string, location: CurrentLocation };

  constructor(
    public dialogRef: MatDialogRef<AddPlaceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private geo: GeolocationService
  ) { }

  ngOnInit() {
    this.initForm();
    this.hits$ = this.searchAddy();
  }

  private initForm() {
    let name = '';
    let address =  '';

    if (this.data.place) {
      name = this.data.place.name;
      address = this.data.place.address;
    }

    this.form = this.fb.group({
      name: [name, [Validators.required]],
      address: [address]
    });
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
    this.useCurrentLocation ? this.createWithCurrentLocation() :
    this.createWithChosenLocation();
  }

  private createWithCurrentLocation() {
    this.geo.currentLocation$
    .subscribe((loc) => this.createPlace(loc));
  }

  private createWithChosenLocation() {
    this.createPlace(this.chosenAddy.location);
  }

  private createPlace(loc: CurrentLocation) {
    this.dialogRef.close({
      ...this.data.place,
      name: this.name.value,
      userId: this.data.user.id,
      loc: loc,
      address: !!this.chosenAddy ? this.chosenAddy.address : ''
    });
  }

  private get address() {
    return this.form.get('address');
  }

  private get name() {
   return this.form.get('name');
  }

}
