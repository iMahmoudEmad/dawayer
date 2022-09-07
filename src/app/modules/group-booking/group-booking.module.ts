import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GroupBookingComponent } from './group-booking.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { HttpClientModule } from '@angular/common/http';

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
    HttpClientModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
  ]
})
export class GroupBookingModule {}
