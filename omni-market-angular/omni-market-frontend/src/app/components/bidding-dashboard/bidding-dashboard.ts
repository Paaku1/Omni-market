import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { AuctionItem } from '../../interfaces/auction-item';
import { Card } from '../../shared/card/card';
import { CommonModule } from '@angular/common'; // Import this
import { RouterModule } from '@angular/router'; // Import this

@Component({
  selector: 'app-bidding-dashboard',
  standalone: true, // Assuming your component is standalone
  imports: [CommonModule, RouterModule, Card], // Add CommonModule and RouterModule here
  templateUrl: './bidding-dashboard.html',
  styleUrls: ['./bidding-dashboard.scss']
})
export class BiddingDashboard implements OnInit, OnDestroy {
  items: AuctionItem[] = []; // This would typically be fetched from your .NET Gateway
  private socket!: WebSocket;

  constructor(private authService: Auth) {}

  ngOnInit(): void {
    // Temporary mock data to see if the UI works
    this.items = [
      { id: '1', title: 'Vintage Watch', description: 'Rare item', currentBid: 100, bidderName: 'None', endTime: new Date(), imageUrl: 'https://via.placeholder.com/150' }
    ];
    this.connectToWebsocket();
  }

  connectToWebsocket() {
    const token = this.authService.getToken();
    // Connect to your Spring Boot Reactive WebSocket
    this.socket = new WebSocket(`ws://localhost:8080/ws/bids?token=${token}`);

    this.socket.onmessage = (event) => {
      const updatedBid = JSON.parse(event.data);
      this.updateLocalBid(updatedBid);
    };

    this.socket.onerror = (error) => console.error('WebSocket Error:', error);
  }

  updateLocalBid(bidData: any) {
    const item = this.items.find((i) => i.id === bidData.auctionId);
    if (item) {
      item.currentBid = bidData.amount;
      item.bidderName = bidData.bidderName;
    }
  }

  ngOnDestroy() {
    this.socket.close();
  }
}
