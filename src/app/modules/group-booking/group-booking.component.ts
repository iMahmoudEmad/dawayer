import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CountryISO } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-group-booking',
  templateUrl: './group-booking.component.html',
  styleUrls: ['./group-booking.component.scss'],
})
export class GroupBookingComponent implements OnInit {
  CountryISO = CountryISO;
  isListShown: boolean = false;
  selectedItem: any;

  profileForm = new FormGroup({
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    mobile: new FormControl('', Validators.required),
    socialLink: new FormControl('', Validators.required),
    numberOfGuests: new FormControl(1),
    transporation: new FormControl(false),
    nearestPickup: new FormControl(''),
    vegeterian: new FormControl(false),
    tents: new FormControl(''),
    numOfDoubleTent: new FormControl(1),
    numOfQuadTent: new FormControl(1),
    numOfBungalow: new FormControl(1),
  });

  constructor() {}

  ngOnInit(): void {}

  get inputValue() {
    return this.profileForm['controls'];
  }

  increment(key: string = 'numberOfGuests') {
    const count: any = this.profileForm.get(key);
    this.profileForm.patchValue({ [key]: count.value + 1 });
  }

  decrement(key: string = 'numberOfGuests') {
    const count: any = this.profileForm.get(key);

    if (count?.value > 1)
      this.profileForm.patchValue({ [key]: count.value - 1 });
  }

  profileValues() {
    console.log('this.profileForm.value', this.profileForm.value);
  }
}
