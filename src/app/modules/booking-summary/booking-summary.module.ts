import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingSummaryComponent } from './booking-summary.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: BookingSummaryComponent,
  },
];

@NgModule({
  declarations: [BookingSummaryComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
})
export class BookingSummaryModule {}
