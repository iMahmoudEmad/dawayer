import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketsService {
  guestsData = new BehaviorSubject([]);
  bookingData = new BehaviorSubject({});

  constructor(private http: HttpClient) {}

  getTickets() {
    return this.http.get('https://dawayer.herokuapp.com/api/v1/products');
  }

  verifyPhone(mobile: string) {
    return this.http.get(
      `https://dawayer.herokuapp.com/api/v1/guests/verifyPhone?phone=${mobile}`
    );
  }
}
