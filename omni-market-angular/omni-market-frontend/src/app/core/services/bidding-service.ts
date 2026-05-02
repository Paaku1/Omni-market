import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../interfaces/product';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BiddingService {

  private readonly biddingUrl = `${environment.gatewayUrl}/api/bidding`
  constructor(
    private readonly http: HttpClient
  ) {}
  getProducts(): Observable<Product>{
    return this.http.get<Product>(`${this.biddingUrl}/products`);
  }
}
