import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TicketsService {
  constructor(private http: HttpClient) {}

  getTickets() {
    return this.http.get('https://dawayer.herokuapp.com/api/v1/products');
  }
}
