import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GroupBookingComponent } from './group-booking.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const routes: Routes = [
  {
    path: '',
    component: GroupBookingComponent,
  },
];

@NgModule({
  declarations: [GroupBookingComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    // BrowserModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    // BrowserAnimationsModule,
  ],
})
export class GroupBookingModule {}
