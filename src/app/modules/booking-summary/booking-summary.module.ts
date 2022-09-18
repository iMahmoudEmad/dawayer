import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingSummaryComponent } from './booking-summary.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';

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
    FormsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [ToastrService],
})
export class BookingSummaryModule {}
