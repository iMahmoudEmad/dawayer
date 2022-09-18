import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { CountryISO } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-group-booking',
  templateUrl: './group-booking.component.html',
  styleUrls: ['./group-booking.component.scss'],
})
export class GroupBookingComponent implements OnInit {
  tickets: any;
  CountryISO = CountryISO;
  isListShown: boolean = false;
  selectedItem: any;
  phoneNumber!: string;
  phoneError!: boolean;
  accommodationQty: number = 0;
  guestQty: number = 0;

  profileForm = new FormGroup({
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/g),
    ]),
    socialMediaLink: new FormControl('', [Validators.required]),
    numberOfGuests: new FormControl({
      id: '',
      quantity: 0,
      name: '',
      price: 0,
    }),
    transportationChecked: new FormControl(false),
    transportation: new FormControl(''),
    isVegeterian: new FormControl(false),
    isOwner: new FormControl(true),
  });

  constructor(
    private ticket: TicketsService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    localStorage.removeItem('phoneList');
    this.ticket.bookingData.subscribe((res) =>
      this.profileForm?.patchValue(res)
    );

    this.ticket.getTickets().subscribe((ticket: any) => {
      this.tickets = ticket.response;
      this.tickets.accommodation.map((accommodation: any) => {
        this.profileForm.addControl(
          accommodation?.name?.charAt(0).toLowerCase() +
            accommodation?.name?.slice(1).replace(/ /g, ''),
          new FormControl({
            id: accommodation?._id,
            quantity: 0,
            name: this.formatName(accommodation?.name),
            price: accommodation?.price,
          })
        );
      });

      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
          return;
        }
        window.scrollTo(0, 0);
      });
    });
  }

  get guestValue() {
    let value = this.inputValue.numberOfGuests.value?.quantity;
    return value && value + 1;
  }

  get inputValue() {
    return this.profileForm['controls'];
  }

  increment(item?: any, isGuestIncrease?: boolean, passingName?: string) {
    if (isGuestIncrease || this.accommodationQty < 8) {
      let name = passingName
        ? this.formatName(passingName)
        : this.formatName(item?.name);

      const count: any = this.profileForm?.get(name);
      if (!isGuestIncrease) this.accommodationQty += 1;

      this.profileForm?.patchValue({
        [name]: {
          id: item?._id,
          quantity: count?.value?.quantity + 1,
          name: item?.name,
          price: item?.price,
        },
      });
    } else {
      this.noAvailableQty(this.accommodationQty);
    }
  }

  decrement(item?: any, passingName?: string) {
    let name = passingName
      ? this.formatName(passingName)
      : this.formatName(item?.name);
    const count: any = this.profileForm?.get(name);
    this.accommodationQty -= 1;

    if (count?.value?.quantity >= 1)
      this.profileForm?.patchValue({
        [name]: {
          id: item?._id,
          quantity: count.value?.quantity - 1,
          name: item?.name,
          price: item?.price,
        },
      });
  }

  setSelectedTransportation(transportation: any) {
    if (transportation?.availability) {
      this.profileForm?.patchValue({ transportation: transportation });
      this.selectedItem = transportation;
      this.isListShown = !this.isListShown;
    }
  }

  formatName(name: string) {
    return name?.charAt(0).toLowerCase() + name?.slice(1).replace(/ /g, '');
  }

  verifyPhone(phone: any) {
    if (phone?.length == 11) {
      this.ticket.verifyPhone(encodeURIComponent(phone)).subscribe(
        (res: any) => {
          if (res.status == 'SUCCESS') {
            this.phoneError = false;
            this.phoneNumber = phone;
            localStorage.setItem('phoneList', JSON.stringify([phone]));
          } else {
            this.phoneError = true;
          }
        },
        () => (this.phoneError = true)
      );
    }
  }

  Accommodation(data: any) {
    const accommodation = [];

    for (let property in data) {
      if (property.includes('double') && data[property]?.quantity) {
        accommodation.push({
          ...data[property],
        });
      }

      if (property.includes('quad') && data[property]?.quantity) {
        accommodation.push({
          ...data[property],
        });
      }

      if (property.includes('byot') && data[property]?.quantity) {
        accommodation.push({
          ...data[property],
        });
      }
    }

    return accommodation;
  }

  async submitForm() {
    let guestsQuantity = this.inputValue.numberOfGuests.value?.quantity;

    if (
      (this.profileForm?.valid && !this.phoneError) ||
      (!this.inputValue.transportation.value &&
        this.inputValue.transportationChecked.value)
    ) {
      let data: any = {
        accommodation:
          (await this.Accommodation(this.profileForm?.value)) || [],
        guests: [this.profileForm?.value],
      };
      data.guests[0].phone = this.phoneNumber;
      data.guests[0].price = this.tickets.ticket[0].price;

      await this.ticket.summaryData.next(data);

      if (guestsQuantity && guestsQuantity >= 1) {
        this.router.navigate(['/guests-booking']);
      } else {
        this.router.navigate(['/accommodation-booking']);
      }
    }
  }

  noAvailableQty(availableQuantity?: number | string) {
    this.toastr.warning(
      '',
      availableQuantity == 0
        ? 'All tickets has been booked'
        : 'You reach the maximum quantity'
    );
  }
}
