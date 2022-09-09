import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestBookingComponent } from './guest-booking.component';

describe('GuestBookingComponent', () => {
  let component: GuestBookingComponent;
  let fixture: ComponentFixture<GuestBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GuestBookingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GuestBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
