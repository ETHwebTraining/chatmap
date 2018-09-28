import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlaceModalComponent } from './add-place-modal.component';

describe('AddPlaceModalComponent', () => {
  let component: AddPlaceModalComponent;
  let fixture: ComponentFixture<AddPlaceModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPlaceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlaceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
