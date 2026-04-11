import { Component, OnInit } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Component({
  selector: 'app-bidding-dashboard',
  template: `
    <div style="padding: 20px;">
      <h2>Live Auction: Prototype Laptop</h2>
      @for (msg of messages; track msg) {
        <div class="bid-alert">
          {{ msg }}
        </div>
      }
    </div>
  `
})
export class BiddingDashboard implements OnInit {
  // Connect to your Spring Boot Engine
  myWebSocket: WebSocketSubject<any> = webSocket('ws://localhost:8080/ws/bids');
  messages: string[] = [];

  ngOnInit() {
    this.myWebSocket.subscribe({
      next:msg => this.messages.push(msg),
      error:err => console.error(err),
      complete:() => console.warn('Completed')
    })
  }
}
