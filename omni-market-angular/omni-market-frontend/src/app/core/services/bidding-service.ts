import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../interfaces/product';
import { environment } from '../../../environments/environment';
import { Auction } from '../../interfaces/auction';

@Injectable({
  providedIn: 'root',
})
export class BiddingService {

  private readonly biddingUrl = `${environment.gatewayUrl}/bidding`
  constructor(
    private readonly http: HttpClient
  ) {}

  getActiveAuctions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.biddingUrl}/active-auctions`);
  }

  getAuctionDetails(auctionId: string): Observable<any> {
    return this.http.get<any>(`${this.biddingUrl}/details/${auctionId}`);
  }
}
