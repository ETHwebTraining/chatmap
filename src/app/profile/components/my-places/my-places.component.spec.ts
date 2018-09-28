import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPlacesComponent } from './my-places.component';

describe('MyPlacesComponent', () => {
  let component: MyPlacesComponent;
  let fixture: ComponentFixture<MyPlacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyPlacesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPlacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
