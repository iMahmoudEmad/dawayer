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
      console.log('guest bookingData res', res);
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
    if (this.guestNum < this.ownerData?.guests[0]?.numberOfGuests?.quantity) {
      this.guestNum++;
      const guestForm = this.fb.group({
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        socialMediaLink: new FormControl('', [
          Validators.required,
          // Validators.pattern(
          //   /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/
          // ),
        ]),
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
        transportation,
      });
      this.selectedItem = transportation;
      this.isListShown = !this.isListShown;
    }
  }

  verifyPhone(phone: any) {
    let phoneList = [...JSON.parse(localStorage.getItem('phoneList') || '{}')];

    let isPhoneFound = () => {
      return phoneList.map((phoneNumber) => {
        return phoneNumber.includes(`${phone?.number}`);
      })[0];
    };

    if (phone?.number?.length == 11) {
      this.ticket
        .verifyPhone(encodeURIComponent(`+2${phone?.number}`))
        .subscribe(
          (res: any) => {
            if (res.status == 'SUCCESS' && !isPhoneFound()) {
              this.phoneError = false;
              this.phoneNumber = `${phone?.number}`;
            } else {
              this.phoneError = true;
            }
          },
          () => (this.phoneError = true)
        );
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

  submitForm() {
    console.log(this.guests.value);
    let data: any = {
      accommodation: this.ownerData?.accommodation,
      guests: [...this.ownerData?.guests, ...this.guests.value],
    };

    this.ticket.summaryData.next(data);

    if (this.ownerData?.guests[0]?.numberOfGuests?.quantity) {
      this.router.navigate(['/summary-booking']);
    } else {
      this.router.navigate(['/group-booking']);
    }
  }
}
