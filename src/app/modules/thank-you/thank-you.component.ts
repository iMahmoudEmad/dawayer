import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss'],
})
export class ThankYouComponent implements OnInit {
  groupData: any;

  constructor(private ticket: TicketsService, private router: Router) {}

  ngOnInit(): void {
    this.ticket.confirmedData.subscribe((res: any) => {
      if (res) {
        this.groupData = res;
      } else {
        this.router.navigate(['/group-booking']);
      }
    });
  }

  /**
   * TODO
   * Implement function to copy all codes
   */
  copyCode() {
    navigator.clipboard.writeText('copyText.value');
  }
}
