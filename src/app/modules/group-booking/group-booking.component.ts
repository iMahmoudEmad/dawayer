import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { CountryISO } from 'ngx-intl-tel-input';
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
    numberOfGuests: new FormControl({
      id: '',
      quantity: 0,
      name: '',
      price: 0,
    }),
    transportationChecked: new FormControl(false),
    transportation: new FormControl(''),
    isVegeterian: new FormControl(false),
    doubleTent: new FormControl({
      id: '',
      quantity: 0,
      name: 'Double Tent',
      price: 0,
    }),
    quadTent: new FormControl({
      id: '',
      quantity: 0,
      name: 'Quad Tent',
      price: 0,
    }),
    islandBungalow: new FormControl({
      id: '',
      quantity: 0,
      name: 'Island Bungalow',
      price: 0,
    }),
    isOwner: new FormControl(true),
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

  accommodationValue(name: string) {
    name = this.formatName(name);
    let data = this.profileForm.get(name) as FormControl;
    return data.value;
  }

  increment(item?: any) {
    const name =
      item?.name !== 'Ticket' ? this.formatName(item?.name) : 'numberOfGuests';
    const count: any = this.profileForm.get(name);

    this.profileForm.patchValue({
      [name]: {
        id: item?._id,
        quantity: count.value?.quantity + 1,
        name: item?.name,
        price: item?.price,
      },
    });
  }

  decrement(item?: any) {
    const name =
      item?.name !== 'Ticket' ? this.formatName(item?.name) : 'numberOfGuests';
    const count: any = this.profileForm.get(name);

    if (count?.value?.quantity >= 1)
      this.profileForm.patchValue({
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
              this.phoneNumber = `${phone?.number}`;
              localStorage.setItem(
                'phoneList',
                JSON.stringify([`${phone?.number}`])
              );
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
    // if (data?.numberOfGuests?.quantity) {
    //   accommodation.push({
    //     id: data?.numberOfGuests?.id,
    //     name: 'Ticket',
    //     price: data?.numberOfGuests?.price,
    //     quantity: data?.numberOfGuests?.quantity,
    //   });
    // }

    if (data?.doubleTent?.quantity) {
      accommodation.push({
        id: data?.doubleTent?.id,
        name: data?.doubleTent?.name,
        price: data?.doubleTent?.price,
        quantity: data?.doubleTent?.quantity,
      });
    }

    if (data?.quadTent?.quantity) {
      accommodation.push({
        id: data?.quadTent?.id,
        name: data?.quadTent?.name,
        price: data?.quadTent?.price,
        quantity: data?.quadTent?.quantity,
      });
    }

    if (data?.islandBungalow?.quantity) {
      accommodation.push({
        id: data?.islandBungalow?.id,
        name: data?.islandBungalow?.name,
        price: data?.islandBungalow?.price,
        quantity: data?.islandBungalow?.quantity,
      });
    }

    return accommodation;
  }

  async submitForm() {
    await this.profileForm.patchValue({
      ...this.profileForm.value,
      phone: `${this.phoneNumber?.substring(2)}`,
    });
    this.profileForm.updateValueAndValidity();
    let guestsQuantity = this.inputValue.numberOfGuests.value?.quantity;
    console.log(this.inputValue.phone.errors);
    
    if (
      this.profileForm.valid &&
      !this.phoneError
    ) {
      let data: any = {
        accommodation: this.Accommodation(this.profileForm.value) || [],
        guests: [this.profileForm.value],
      };
      data.guests[0].phone = this.phoneNumber;

      if (guestsQuantity && guestsQuantity >= 1) {
        await this.ticket.bookingData.next(data);
        this.router.navigate(['/guests-booking']);
      } else {
        await this.ticket.summaryData.next(data);
        this.router.navigate(['/summary-booking']);
      }
    }
  }
}
