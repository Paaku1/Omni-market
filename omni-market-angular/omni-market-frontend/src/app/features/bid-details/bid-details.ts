import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-bid-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bid-details.html',
  styleUrls: ['./bid-details.scss'],
})
export class BidDetails implements OnInit, OnDestroy {
  itemId: string | null = null;
  bidAmount: number = 0;
  private socket!: WebSocket;
  currentPrice: number = 1250; // In a real app, fetch this via HTTP first
  highBidder: string = 'None';
  priceJustChanged = false;
  errorMessage: string = ''; // Added to fix the 'does not exist' error

  constructor(
    private authService: Auth,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id');
    this.connectToWebsocket();
  }

  connectToWebsocket() {
    const token = this.authService.getToken();
    this.socket = new WebSocket(`ws://localhost:8080/ws/bids?token=${token}`);

    this.socket.onmessage = (event) => {
      // Check if message is JSON to avoid the 'Unexpected token I' error
      if (event.data.startsWith('{')) {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'NEW_BID') {
            this.currentPrice = data.amount;
            this.priceJustChanged = true;
            this.errorMessage = ''; // Clear errors on successful bid update
            setTimeout(() => (this.priceJustChanged = false), 1000);
          }
        } catch (e) {
          console.error('JSON Parse Error:', e);
        }
      } else {
        // Handle plain text errors from Spring Boot (e.g., "Invalid JSON...")
        console.warn('Server Message:', event.data);
        this.errorMessage = event.data;
      }
    };

    this.socket.onerror = (err) => {
      this.errorMessage = 'WebSocket connection failed. The engine might be down.';
    };
  }

  placeBid() {
    const userId = this.authService.getCurrentUserId();

    if (!userId) {
      alert("You must be logged in to place a bid.");
      return;
    }

    if (this.bidAmount <= this.currentPrice) {
      alert("Bid must be higher than the current price!");
      return;
    }

    const payload = {
      // This MUST be a valid 36-char UUID string
      auctionId: this.itemId,
      amount: this.bidAmount,
      bidderId: this.authService.getCurrentUserId()
    };

    // Sending as JSON string for BiddingHandler.java objectMapper
    this.socket.send(JSON.stringify(payload));
    this.bidAmount = 0;
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.close();
    }
  }
}
