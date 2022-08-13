import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CountryISO } from 'ngx-intl-tel-input';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-guest-booking',
  templateUrl: './guest-booking.component.html',
  styleUrls: ['./guest-booking.component.scss'],
})
export class GuestBookingComponent implements OnInit {
  tickets: any;
  CountryISO = CountryISO;
  isListShown: boolean = false;
  selectedItem: any;
  guestNum: number = 0;
  ownerData: any;

  form = this.fb.group({
    guests: this.fb.array([]),
  });

  constructor(
    private ticket: TicketsService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.ticket
      .getTickets()
      .subscribe((ticket: any) => (this.tickets = ticket.response));

    this.ticket.bookingData.subscribe((data) => {
      this.ownerData = data;
      console.log('ownerData', this.ownerData);
      this.addGuest(0);
    });
  }

  get guests() {
    return this.form.controls['guests'] as FormArray;
  }

  getFormGroupAt(i: number) {
    return this.guests.at(i) as FormGroup;
  }

  addGuest(index: number) {
    if (this.guestNum < this.ownerData?.numberOfGuests?.quantity) {
      this.guestNum++;
      const guestForm = this.fb.group({
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        socialMediaLink: ['', Validators.required],
        transporation: [false],
        nearestPickup: [''],
        vegeterian: [false],
        isOwner: [false],
      });
      this.guests.push(guestForm);
      this.getValidity(index).patchValue({
        phone: this.getValidity(index).value.phone.number,
      });

      console.log(this.getValidity(index).value);
    } else {
      this.getValidity(index).patchValue({
        phone: this.getValidity(index).value.phone.number,
      });

      console.log(this.getValidity(index).value);
      this.submitForm();
    }
  }

  getValidity(i: number) {
    return (<FormArray>this.form.get('guests')).controls[i];
  }

  setSelectedTransportation(transportation: any) {
    if (transportation?.availability) {
      this.selectedItem = transportation;
      this.isListShown = !this.isListShown;
    }
  }

  verifyPhone(phone: string) {
    if (phone?.length == 11) {
      this.ticket.verifyPhone(phone).subscribe((res: any) => {
        // if (res.status == 'SUCCESS') {
        //   this.form.patchValue({
        //     phone,
        //   });
        // }
        // console.log(res);
      });
    }
  }

  get Accommodation() {
    const accommodation = [];
    if (this.ownerData?.doubleTent?.quantity)
      accommodation.push({
        id: this.ownerData?.doubleTent?.id,
        quantity: this.ownerData?.doubleTent?.quantity,
      });

    if (this.ownerData?.quadTent?.quantity)
      accommodation.push({
        id: this.ownerData?.quadTent?.id,
        quantity: this.ownerData?.quadTent?.quantity,
      });

    if (this.ownerData?.islandBungalow?.quantity)
      accommodation.push({
        id: this.ownerData?.islandBungalow?.id,
        quantity: this.ownerData?.islandBungalow?.quantity,
      });

    return accommodation;
  }

  submitForm() {
    let data: any = {
      guests: [this.ownerData, ...this.guests.value],
    };

    if (this.Accommodation.length) data.accommodation = this.Accommodation;

    this.ticket.bookingConfirmation(data).subscribe();

    // console.log(data);
  }

  test() {
    this.guestNum = this.guestNum - 1;
  }
}
