import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBookingSummaryComponent } from './add-edit-booking-summary.component';

describe('AddEditBookingSummaryComponent', () => {
  let component: AddEditBookingSummaryComponent;
  let fixture: ComponentFixture<AddEditBookingSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditBookingSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditBookingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
