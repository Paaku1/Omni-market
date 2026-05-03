import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { AuctionItem } from '../../interfaces/auction-item';
import { Card } from '../../shared/card/card';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BiddingService } from '../../core/services/bidding-service';

@Component({
  selector: 'app-bidding-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, Card],
  templateUrl: './bidding-dashboard.html',
  styleUrls: ['./bidding-dashboard.scss']
})
export class BiddingDashboard implements OnInit, OnDestroy {
  items: AuctionItem[] = [];
  private socket!: WebSocket;

  constructor(
    private readonly authService: Auth,
    private readonly biddingService: BiddingService,
    private cdr: ChangeDetectorRef
    ) {}

  ngOnInit(): void {
    this.loadActiveAuctions();
    this.connectToWebsocket();
  }

  private loadActiveAuctions() {
    this.biddingService.getActiveAuctions().subscribe({
      next: (data : AuctionItem[]) => {
        this.items = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Gateway Error",err)
    })
  }

  connectToWebsocket() {
    const token = this.authService.getToken();
    this.socket = new WebSocket(`ws://localhost:8080/ws/bids?token=${token}`);

    this.socket.onmessage = (event) => {
      const updatedBid = JSON.parse(event.data);
      this.updateLocalBid(updatedBid);
    };

    this.socket.onerror = (error) => console.error('WebSocket Error:', error);
  }

  updateLocalBid(bidData: any) {
    const item = this.items.find((i) => i.auctionId === bidData.auctionId);

    if (item) {
      item.currentBid = bidData.amount;
      item.bidderName = bidData.bidderName;
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    this.socket.close();
  }
}
