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

  profileForm = new FormGroup({
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/g),
    ]),
    socialMediaLink: new FormControl('', [
      Validators.required,
      // Validators.pattern(
      //   /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/
      // ),
    ]),
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

  verifyPhone(phone: any) {
    phone = phone?.target?.value;
    if (phone?.length == 11) {
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
    if (this.backupData.guests[this.dynamicIdx].phone?.length > 11) {
      this.backupData.guests[this.dynamicIdx].phone = `${
        this.backupData.guests[this.dynamicIdx]?.phone
      }`;
    } else {
      this.backupData.guests[this.dynamicIdx].phone = `${
        this.backupData.guests[this.dynamicIdx]?.phone
      }`;
    }
    this.backupData.guests[this.dynamicIdx].price = price;

    if (!this.phoneError) {
      this.ticket.summaryData.next(this.backupData);
      this.router.navigate(['/summary-booking']);
    }
  }
}
