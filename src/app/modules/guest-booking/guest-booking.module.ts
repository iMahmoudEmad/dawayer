import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuestBookingComponent } from './guest-booking.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { OnlynumberModule } from 'src/app/onlynumber.module';

const routes: Routes = [
  {
    path: '',
    component: GuestBookingComponent,
  },
];

@NgModule({
  declarations: [GuestBookingComponent],
  imports: [
    OnlynumberModule,
    RouterModule.forChild(routes),
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
  ],
})
export class GuestBookingModule {}
