import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-booking-summary',
  templateUrl: './booking-summary.component.html',
  styleUrls: ['./booking-summary.component.scss'],
})
export class BookingSummaryComponent implements OnInit {
  bookingData: any;
  selectedPhone!: string;

  constructor(private ticket: TicketsService, private router: Router) {}

  ngOnInit(): void {
    this.ticket.summaryData.subscribe((res: any) => (this.bookingData = res));
  }

  totalAmount() {
    let sum = 0;

    for (let i = 0; i < this.bookingData?.accommodation.length; i++) {
      sum +=
        this.bookingData?.accommodation[i]?.quantity *
        this.bookingData?.accommodation[i]?.price;
    }
    return sum;
  }

  selectedPerson(person: any) {
    this.selectedPhone = person?.phone;
  }

  submitSummary() {
    this.ticket.bookingConfirmation(this.bookingData).subscribe((res: any) => {
      this.ticket.confirmedData.next(res?.response?.group);
      this.router.navigate(['/thank-you']);
    });
  }
}
