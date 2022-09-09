import { TicketsService } from 'src/app/services/tickets.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'dawayer';
  isLoaderShown: boolean = true;

  constructor(private ticket: TicketsService) {
    setTimeout(() => {
      this.isLoaderShown = false;
    }, 1000);
  }

  onActivate(event: any) {
    window.scroll(0, 0);
    //or document.body.scrollTop = 0;
    //or document.querySelector('body').scrollTo(0,0)
  }
}
