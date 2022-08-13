import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  profileForm = new FormGroup({
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.required),
    socialLink: new FormControl('', Validators.required),
    numberOfGuests: new FormControl({ id: '', quantity: 1 }),
    transporation: new FormControl(false),
    nearestPickup: new FormControl(''),
    vegeterian: new FormControl(false),
    tents: new FormControl(''),
    doubleTent: new FormControl({ id: '', quantity: 0 }),
    quadTent: new FormControl({ id: '', quantity: 0 }),
    islandBungalow: new FormControl({ id: '', quantity: 0 }),
    isOwner: new FormControl(true),
  });

  constructor(private ticket: TicketsService, private router: Router) {}

  ngOnInit(): void {
    this.ticket.bookingData.subscribe((res) =>
      this.profileForm.patchValue(res)
    );

    this.ticket
      .getTickets()
      .subscribe((ticket: any) => (this.tickets = ticket.response));
  }

  get inputValue() {
    return this.profileForm['controls'];
  }

  accommodationValue(name: string) {
    name = this.formatName(name);
    let data = this.profileForm.get(name) as FormControl;

    return data.value;
  }

  increment(key: string = 'numberOfGuests', id: string = 'numberOfGuests') {
    key = this.formatName(key);
    const count: any = this.profileForm.get(key);
    this.profileForm.patchValue({
      [key]: { id, quantity: count.value?.quantity + 1 },
    });
  }

  decrement(key: string = 'numberOfGuests', id: string = 'numberOfGuests') {
    key = this.formatName(key);
    const count: any = this.profileForm.get(key);

    if (count?.value?.quantity >= 1)
      this.profileForm.patchValue({
        [key]: { id, quantity: count.value?.quantity - 1 },
      });
  }

  setSelectedTransportation(transportation: any) {
    if (transportation?.availability) {
      this.selectedItem = transportation;
      this.isListShown = !this.isListShown;
    }
  }

  formatName(name: string) {
    return name.charAt(0).toLowerCase() + name.slice(1).replace(/ /g, '');
  }

  verifyPhone(phone: string) {
    if (phone?.length == 11) {
      this.ticket.verifyPhone(phone).subscribe((res: any) => {
        // if (res.status == 'SUCCESS') {
        //   this.profileForm.patchValue({
        //     phone,
        //   });
        // }
        console.log(res);
      });
    }
  }

  async submitForm() {
    if (this.profileForm.valid) {
      let data: any = this.profileForm.value;
      data.phone = this.profileForm.get('phone');
      data.phone = data.phone.value.number;
      console.log(data);

      await this.ticket.bookingData.next(data);
      this.ticket.bookingData.subscribe((res) => console.log('res', res));
      this.router.navigate(['/guests-booking']);
    }
  }
}
