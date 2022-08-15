import { Component, OnInit } from '@angular/core';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss'],
})
export class ThankYouComponent implements OnInit {
  groupData: any;

  constructor(private ticket: TicketsService) {}

  ngOnInit(): void {
    this.ticket.confirmedData.subscribe((res: any) => {
      console.log(res);
      this.groupData = res;
    });
  }
}
