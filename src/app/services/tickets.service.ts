import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketsService {
  guestsData = new BehaviorSubject<any[]>([]);
  bookingData = new BehaviorSubject<object>({});
  summaryData = new BehaviorSubject<object>({});
  confirmedData = new BehaviorSubject<object>({});
  loader = new BehaviorSubject<boolean>(true);
  environmentUrl = 'https://dawayer.herokuapp.com'; //https://dawayer-staging.herokuapp.com

  constructor(private http: HttpClient) {}

  getTickets() {
    return this.http.get(`${this.environmentUrl}/api/v1/products`);
  }

  bookingConfirmation(data: any) {
    return this.http.post(`${this.environmentUrl}/api/v1/groups`, data);
  }

  verifyPhone(phone: string) {
    return this.http.get(
      `${this.environmentUrl}/api/v1/guests/verifyPhone?phone=${phone}`
    );
  }

  voucherCodeVerify(code: string) {
    return this.http.get(
      `${this.environmentUrl}/api/v1/vouchers/verify?code=${code}`
    );
  }
}
