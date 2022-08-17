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
    phone: new FormControl('', Validators.required),
    socialMediaLink: new FormControl('', Validators.required),
    numberOfGuests: new FormControl({
      id: '',
      quantity: 0,
      name: '',
      price: 0,
    }),
    transporationChecked: new FormControl(false),
    transporation: new FormControl(''),
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
    console.log(data.value);
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
      this.profileForm.patchValue({ transporation: transportation?._id });
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
              localStorage.setItem(
                'phoneList',
                JSON.stringify([`+2${phone?.number}`])
              );
            } else {
              this.phoneError = true;
            }
          },
          () => (this.phoneError = true)
        );
    }
  }

  async submitForm() {
    let guestsQuantity = this.inputValue.numberOfGuests.value?.quantity;
    if (
      this.profileForm.valid &&
      !this.phoneError &&
      guestsQuantity &&
      guestsQuantity >= 1
    ) {
      let data: any = this.profileForm.value;
      data.phone = this.phoneNumber;

      await this.ticket.bookingData.next(data);
      this.router.navigate(['/guests-booking']);
    }
  }
}
