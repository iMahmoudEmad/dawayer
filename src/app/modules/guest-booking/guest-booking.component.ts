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
  phoneNumber!: string;
  phoneError!: boolean;

  form = this.fb.group({
    guests: this.fb.array([]),
  });

  constructor(
    private ticket: TicketsService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  async ngOnInit() {
    this.ticket
      .getTickets()
      .subscribe((ticket: any) => (this.tickets = ticket.response));

    await this.ticket.bookingData.subscribe((res: any) => {
      if (res) {
        this.ownerData = res;
        this.addGuest(0);
      } else {
        this.router.navigate(['/group-booking']);
      }
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
        transportationChecked: [false],
        transportation: [''],
        isVegeterian: [false],
        isOwner: [false],
      });
      this.guests.push(guestForm);
      this.getValidity(index)?.patchValue({
        phone: this.getValidity(index)?.value.phone.number,
      });
    } else {
      this.getValidity(index)?.patchValue({
        phone: this.getValidity(index)?.value.phone.number,
      });

      this.submitForm();
    }
  }

  getValidity(i: number) {
    return (<FormArray>this.form.get('guests')).controls[i];
  }

  setSelectedTransportation(transportation: any, index: number) {
    if (transportation?.availability) {
      this.getValidity(index)?.patchValue({
        transportation: transportation?._id,
      });
      this.selectedItem = transportation;
      this.isListShown = !this.isListShown;
    }
  }

  verifyPhone(phone: any) {
    if (phone?.number?.length == 11) {
      this.ticket.verifyPhone(phone).subscribe((res: any) => {
        console.log('res', res);
        res.status == 'SUCCESS'
          ? (this.phoneNumber = phone.number)
          : (this.phoneError = true);
      });
    }
  }

  guestNavigationText(): string {
    if (this.guestNum > 1) {
      return `< Back to guest ${this.guestNum}`;
    } else {
      return '< Back to personal info';
    }
  }

  decreaseGuestNumber() {
    if (this.guestNum > 1) {
      this.guestNum = this.guestNum - 1;
    } else {
      this.router.navigate(['/group-booking']);
    }
  }

  get Accommodation() {
    const accommodation = [];
    if (this.ownerData?.numberOfGuests?.quantity) {
      accommodation.push({
        id: this.ownerData?.numberOfGuests?.id,
        name: 'Ticket',
        price: this.ownerData?.numberOfGuests?.price,
        quantity: this.ownerData?.numberOfGuests?.quantity,
      });
    }

    if (this.ownerData?.doubleTent?.quantity) {
      accommodation.push({
        id: this.ownerData?.doubleTent?.id,
        name: this.ownerData?.doubleTent?.name,
        price: this.ownerData?.doubleTent?.price,
        quantity: this.ownerData?.doubleTent?.quantity,
      });
    }

    if (this.ownerData?.quadTent?.quantity) {
      accommodation.push({
        id: this.ownerData?.quadTent?.id,
        name: this.ownerData?.quadTent?.name,
        price: this.ownerData?.quadTent?.price,
        quantity: this.ownerData?.quadTent?.quantity,
      });
    }

    if (this.ownerData?.islandBungalow?.quantity) {
      accommodation.push({
        id: this.ownerData?.islandBungalow?.id,
        name: this.ownerData?.islandBungalow?.name,
        price: this.ownerData?.islandBungalow?.price,
        quantity: this.ownerData?.islandBungalow?.quantity,
      });
    }

    return accommodation;
  }

  submitForm() {
    let data: any = {
      guests: [this.ownerData, ...this.guests.value],
      accommodation: this.Accommodation || [],
    };

    this.ticket.summaryData.next(data);

    this.router.navigate(['/summary-booking']);
  }
}
