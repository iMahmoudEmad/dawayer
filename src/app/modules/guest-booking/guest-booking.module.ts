import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuestBookingComponent } from './guest-booking.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { TicketsService } from 'src/app/services/tickets.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const routes: Routes = [
  {
    path: '',
    component: GuestBookingComponent,
  },
];

@NgModule({
  declarations: [GuestBookingComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
  ],
  providers: [TicketsService],
})
export class GuestBookingModule {}
