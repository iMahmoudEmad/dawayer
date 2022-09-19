import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GroupBookingComponent } from './group-booking.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { OnlynumberModule } from 'src/app/onlynumber.module';

const routes: Routes = [
  {
    path: '',
    component: GroupBookingComponent,
  },
];

@NgModule({
  declarations: [GroupBookingComponent],
  imports: [
    OnlynumberModule,
    RouterModule.forChild(routes),
    CommonModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
  ],
  providers: [ToastrService],
})
export class GroupBookingModule {}
