import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'group-booking',
    loadChildren: () =>
      import('./modules/group-booking/group-booking.module').then(
        (m) => m.GroupBookingModule
      ),
  },
  {
    path: 'guests-booking',
    loadChildren: () =>
      import('./modules/guest-booking/guest-booking.module').then(
        (m) => m.GuestBookingModule
      ),
  },
  {
    path: 'accommodation-booking',
    loadChildren: () =>
      import('./modules/accommodation/accommodation.module').then(
        (m) => m.AccommodationModule
      ),
  },
  {
    path: 'summary-booking',
    loadChildren: () =>
      import('./modules/booking-summary/booking-summary.module').then(
        (m) => m.BookingSummaryModule
      ),
  },
  {
    path: 'summary-booking/:idx',
    loadChildren: () =>
      import(
        './modules/add-edit-booking-summary/add-edit-booking-summary.module'
      ).then((m) => m.AddEditBookingSummaryModule),
  },
  {
    path: 'thank-you',
    loadChildren: () =>
      import('./modules/thank-you/thank-you.module').then(
        (m) => m.ThankYouModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
