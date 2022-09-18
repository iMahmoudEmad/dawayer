import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-accommodation',
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.scss'],
})
export class AccommodationComponent implements OnInit {
  tickets: any;
  accommodationQty: number = 0;

  profileForm = new FormGroup({});

  constructor(
    private ticket: TicketsService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
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

  formatName(name: string) {
    return name?.charAt(0).toLowerCase() + name?.slice(1).replace(/ /g, '');
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

  decrement(item?: any) {
    const name =
      item?.name !== 'Ticket' ? this.formatName(item?.name) : 'numberOfGuests';
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

  Accommodation(data: any) {
    const accommodation = [];

    for (let property in data) {
      if (data[property]?.quantity) {
        accommodation.push({
          ...data[property],
        });
      }
    }

    return accommodation;
  }

  accommodationValue(name: string) {
    name = this.formatName(name);

    let data = this.profileForm?.get(name) as FormControl;
    return data?.value;
  }

  get inputValue() {
    return this.profileForm['controls'];
  }

  async submitForm() {
    let data: any = {
      ...this.ticket.summaryData.value,
      accommodation: (await this.Accommodation(this.profileForm?.value)) || [],
    };

    await this.ticket.summaryData.next(data);
    this.router.navigate(['/summary-booking']);
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
