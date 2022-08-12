import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
    mobile: new FormControl('', Validators.required),
    socialLink: new FormControl('', Validators.required),
    numberOfGuests: new FormControl(1),
    transporation: new FormControl(false),
    nearestPickup: new FormControl(''),
    vegeterian: new FormControl(false),
    tents: new FormControl(''),
    doubleTent: new FormControl(1),
    quadTent: new FormControl(1),
    islandBungalow: new FormControl(1),
  });

  constructor(private ticket: TicketsService) {}

  ngOnInit(): void {
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

  increment(key: string = 'numberOfGuests') {
    key = this.formatName(key);
    const count: any = this.profileForm.get(key);
    this.profileForm.patchValue({ [key]: count.value + 1 });
  }

  decrement(key: string = 'numberOfGuests') {
    key = this.formatName(key);
    const count: any = this.profileForm.get(key);

    if (count?.value > 1)
      this.profileForm.patchValue({ [key]: count.value - 1 });
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
}
