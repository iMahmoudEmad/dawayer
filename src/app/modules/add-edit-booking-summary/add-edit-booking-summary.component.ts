import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { CountryISO } from 'ngx-intl-tel-input';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-add-edit-booking-summary',
  templateUrl: './add-edit-booking-summary.component.html',
  styleUrls: ['./add-edit-booking-summary.component.scss'],
})
export class AddEditBookingSummaryComponent implements OnInit {
  tickets: any;
  CountryISO = CountryISO;
  isListShown: boolean = false;
  selectedItem: any;
  phoneNumber!: string;
  phoneError!: boolean;

  profileForm = new FormGroup({
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/g),
    ]),
    socialMediaLink: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/
      ),
    ]),
    transportationChecked: new FormControl(false),
    transportation: new FormControl(''),
    isVegeterian: new FormControl(false),
    isOwner: new FormControl(false),
  });

  constructor(private ticket: TicketsService, private router: Router) {}

  ngOnInit(): void {
    localStorage.removeItem('phoneList');
    this.ticket.bookingData.subscribe((res) =>
      this.profileForm.patchValue(res)
    );

    this.ticket.getTickets().subscribe((ticket: any) => {
      this.tickets = ticket.response;
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
          return;
        }
        window.scrollTo(0, 0);
      });
    });
  }

  get inputValue() {
    return this.profileForm['controls'];
  }

  setSelectedTransportation(transportation: any) {
    if (transportation?.availability) {
      this.profileForm.patchValue({ transportation: transportation });
      this.selectedItem = transportation;
      this.isListShown = !this.isListShown;
    }
  }

  formatName(name: string) {
    return name.charAt(0).toLowerCase() + name.slice(1).replace(/ /g, '');
  }

  verifyPhone(phone: any) {
    if (phone?.number?.length == 11) {
      this.ticket
        .verifyPhone(encodeURIComponent(`+2${phone?.number}`))
        .subscribe(
          (res: any) => {
            if (res.status == 'SUCCESS') {
              this.phoneError = false;
              this.phoneNumber = `+2${phone?.number}`;
            } else {
              this.phoneError = true;
            }
          },
          () => (this.phoneError = true)
        );
    }
  }

  submitForm() {
    // await this.profileForm.patchValue({
    //   ...this.profileForm.value,
    //   phone: `${this.phoneNumber.substring(2)}`,
    // });
    // this.profileForm.updateValueAndValidity();
    // console.log(typeof this.inputValue.phone.value);
    // console.log(this.inputValue.phone.value);
    // console.log(this.inputValue.phone.valid);
    // console.log(this.inputValue.phone.errors);
    // console.log(this.profileForm.valid);
    // console.log(this.profileForm.invalid);
    // console.log(this.profileForm.errors);
    // console.log(this.profileForm.value);
    // console.log(guestsQuantity);
    if (
      // this.profileForm.valid &&
      !this.phoneError
    ) {
      let data: any = {
        guests: [this.profileForm.value],
      };
      data.guests[0].phone = this.phoneNumber;

      // if (guestsQuantity && guestsQuantity >= 1) {
      this.ticket.bookingData.next(data);
      this.router.navigate(['/guests-booking']);
      // }
      // else {
      //   await this.ticket.summaryData.next(data);
      //   this.router.navigate(['/summary-booking']);
      // }
    }
  }
}
