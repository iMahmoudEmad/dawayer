import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { AddEditBookingSummaryComponent } from './add-edit-booking-summary.component';

const routes: Routes = [
  {
    path: '',
    component: AddEditBookingSummaryComponent,
  },
];

@NgModule({
  declarations: [AddEditBookingSummaryComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
  ],
})
export class AddEditBookingSummaryModule {}
