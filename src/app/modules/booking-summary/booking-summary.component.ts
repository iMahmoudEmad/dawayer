import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-booking-summary',
  templateUrl: './booking-summary.component.html',
  styleUrls: ['./booking-summary.component.scss'],
})
export class BookingSummaryComponent implements OnInit {
  bookingData: any;
  selectedPhone!: string;
  isLoaderShown!: boolean;
  voucherCode!: string;
  numOfTransportationGuests: number = 0;
  totalAmoutOfTransportationGuests: number = 0;

  constructor(
    private ticket: TicketsService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.ticket.summaryData.subscribe(async (res: any) => {
      if (res) {
        this.bookingData = res;
        await this.totalTransportationGuests();
      } else {
        this.router.navigate(['/group-booking']);
      }
    });
  }

  totalTransportationGuests() {
    this.bookingData?.guests?.map((item: any) => {
      if (item?.transportationChecked && item?.transportation?.price) {
        this.numOfTransportationGuests += 1;
        this.totalAmoutOfTransportationGuests += item?.transportation?.price;
      }
    });
  }

  totalAmount() {
    let sum = 0;

    for (let i = 0; i < this.bookingData?.accommodation.length; i++) {
      sum +=
        this.bookingData?.accommodation[i]?.quantity *
        this.bookingData?.accommodation[i]?.price;
    }
    if (this.totalAmoutOfTransportationGuests) {
      return (
        this.bookingData.guests[0]?.price * this.bookingData.guests?.length +
        sum +
        this.totalAmoutOfTransportationGuests
      );
    } else {
      return (
        this.bookingData.guests[0]?.price * this.bookingData.guests?.length +
        sum
      );
    }
  }

  selectedPerson(person: any) {
    this.selectedPhone = person?.phone;
  }

  removePerson(phone: string) {
    let dataAfterRemoved = this.bookingData;
    dataAfterRemoved = dataAfterRemoved.guests.filter((person: any) => {
      return person?.phone !== phone;
    });

    this.bookingData.guests = dataAfterRemoved;
  }

  voucherCodeVerify() {
    this.ticket.voucherCodeVerify(this.voucherCode).subscribe((res: any) => {
      console.log('voucher res ---->', res);
    });
  }

  submitSummary() {
    this.isLoaderShown = true;
    this.bookingData.voucher = this.voucherCode;
    this.ticket.bookingConfirmation(this.bookingData).subscribe(
      (res: any) => {
        this.isLoaderShown = false;
        this.ticket.confirmedData.next(res?.response?.group);
        this.toastr.success('', 'Booking successfully!');

        this.router.navigate(['/thank-you']);
      },
      (err: any) => {
        this.isLoaderShown = false;
        this.toastr.error(
          '',
          err?.messages?.en || 'An error occured in server, please try later'
        );
      }
    );
  }
}
