import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CountryISO } from 'ngx-intl-tel-input';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-add-edit-booking-summary',
  templateUrl: './add-edit-booking-summary.component.html',
  styleUrls: ['./add-edit-booking-summary.component.scss'],
})
export class AddEditBookingSummaryComponent implements OnInit {
  dynamicIdx: number | string = 0;
  backupData!: any;
  tickets: any;
  CountryISO = CountryISO;
  isListShown: boolean = false;
  selectedItem: any;
  phoneNumber!: string;
  phoneError!: boolean;
  dialCode!: string;
  backupPhone!: string;

  profileForm = new FormGroup({
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/g),
    ]),
    socialMediaLink: new FormControl('', [Validators.required]),
    transportationChecked: new FormControl(false),
    transportation: new FormControl(''),
    isVegeterian: new FormControl(false),
    isOwner: new FormControl(false),
  });

  constructor(
    private ticket: TicketsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => (this.dynamicIdx = params['idx']));

    this.ticket.summaryData.subscribe((res) => {
      this.backupData = res;

      this.profileForm.patchValue({
        ...this.backupData?.guests[this.dynamicIdx],
      });
      this.selectedItem =
        this.backupData?.guests[this.dynamicIdx].transportation;
    });

    this.ticket.getTickets().subscribe((ticket: any) => {
      this.tickets = ticket.response;
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
          return;
        }
        window.scrollTo(0, 0);
      });
    });
  }

  get inputValue() {
    return this.profileForm['controls'];
  }

  setSelectedTransportation(transportation: any) {
    if (transportation?.availability) {
      this.profileForm.patchValue({ transportation: transportation });
      this.selectedItem = transportation;
      this.isListShown = !this.isListShown;
    }
  }

  formatName(name: string) {
    return name.charAt(0).toLowerCase() + name.slice(1).replace(/ /g, '');
  }

  verifyPhone(phone: string, dialCode: string) {
    this.dialCode = dialCode;
    // phone = phone?.target?.value;
    if (this.backupPhone !== phone && phone?.length >= 11) {
      this.backupPhone = phone;
      this.ticket.verifyPhone(encodeURIComponent(phone)).subscribe(
        (res: any) => {
          if (res.status == 'SUCCESS') {
            this.phoneError = false;
            this.phoneNumber = phone;
          } else {
            this.phoneError = true;
          }
        },
        () => (this.phoneError = true)
      );
    }
  }

  submitForm() {
    let price = this.backupData.guests[this.dynamicIdx].price;
    this.backupData.guests[this.dynamicIdx] = this.profileForm?.value;

    this.backupData.guests[this.dynamicIdx].dialCode = this.dialCode;
    this.backupData.guests[this.dynamicIdx].price = price;

    if (!this.phoneError) {
      this.ticket.summaryData.next(this.backupData);
      this.router.navigate(['/summary-booking']);
    }
  }
}
