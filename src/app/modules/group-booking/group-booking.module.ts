import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GroupBookingComponent } from './group-booking.component';

const routes: Routes = [
  {
    path: '',
    component: GroupBookingComponent,
  },
];

@NgModule({
  declarations: [GroupBookingComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class GroupBookingModule {}
