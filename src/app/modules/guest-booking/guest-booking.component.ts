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
  guestNum: number = 1;

  form = this.fb.group({
    guests: this.fb.array([]),
  });

  constructor(
    private ticket: TicketsService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.addGuest();
    this.guestNum++;
    this.ticket
      .getTickets()
      .subscribe((ticket: any) => (this.tickets = ticket.response));
  }

  get guests() {
    return this.form.controls['guests'] as FormArray;
  }

  getFormGroupAt(i: number) {
    return this.guests.at(i) as FormGroup;
  }

  addGuest() {
    if (this.guestNum != 1) {
      this.guestNum++;
    }
    const guestForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      socialLink: ['', Validators.required],
      transporation: [false],
      nearestPickup: [''],
      vegeterian: [false],
    });

    this.guests.push(guestForm);
  }

  setSelectedTransportation(transportation: any) {
    if (transportation?.availability) {
      this.selectedItem = transportation;
      this.isListShown = !this.isListShown;
    }
  }

  verifyPhone(mobile: string) {
    this.ticket.verifyPhone(mobile).subscribe((res: any) => {
      // if (res.status == 'SUCCESS') {
      //   this.form.patchValue({
      //     mobile,
      //   });
      // }
      console.log(res);
    });
  }

  submitForm() {
    if (this.form.valid) {
      let data: any = this.form.value;
      data.mobile = this.form.get('mobile');
      data.mobile = data.mobile.value.number;
      console.log(data);

      this.ticket.bookingData.next(data);

      // this.router.navigate(['/']);
    }
  }
}
