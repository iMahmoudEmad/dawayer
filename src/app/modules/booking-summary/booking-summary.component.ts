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
  isVoucherLoaderShown!: boolean;
  voucherCode: string = '';
  voucherData: any;
  voucherError!: string;
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
        if (res.voucherCode) this.voucherData = res?.voucherCode;
        if (this.numOfTransportationGuests == 0)
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
    let total =
      this.bookingData.guests[0]?.price * this.bookingData.guests?.length;

    for (let i = 0; i < this.bookingData?.accommodation?.length; i++) {
      sum +=
        this.bookingData?.accommodation[i]?.quantity *
        this.bookingData?.accommodation[i]?.price;
    }

    if (this.voucherData) {
      total =
        this.bookingData?.guests?.length * this.bookingData?.guests[0]?.price -
        (this.bookingData?.guests?.length *
          this.bookingData?.guests[0]?.price *
          this.voucherData?.percentage) /
          100;
    }
    return total + sum + this.totalAmoutOfTransportationGuests;
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
    this.isVoucherLoaderShown = true;

    this.ticket.voucherCodeVerify(this.voucherCode).subscribe(
      (res: any) => {
        this.ticket.summaryData.next({
          ...this.bookingData,
          voucherCode: res?.response?.voucher,
        });
        this.isVoucherLoaderShown = false;
        this.voucherData = res?.response?.voucher;
        this.toastr.success('', res?.messages?.en);
      },
      (err: any) => {
        this.isVoucherLoaderShown = false;
        this.voucherError = err?.error?.messages?.en;
        this.toastr.error('', err?.error?.messages?.en);
      }
    );
  }

  resetVoucher() {
    this.voucherError = '';
    this.voucherCode = '';
    this.voucherData = '';
  }

  submitSummary() {
    this.isLoaderShown = true;
    this.bookingData.voucher = this.voucherCode || this.voucherData?.code;
    this.ticket.bookingConfirmation(this.bookingData).subscribe(
      (res: any) => {
        this.isLoaderShown = false;
        this.ticket.confirmedData.next(res?.response?.group);
        this.toastr.success('', 'Voucher applied'); //res?.messages?.en

        this.router.navigate(['/thank-you']);
      },
      (err: any) => {
        this.isLoaderShown = false;
        this.toastr.error('', err?.error?.messages?.en);
      }
    );
  }
}
