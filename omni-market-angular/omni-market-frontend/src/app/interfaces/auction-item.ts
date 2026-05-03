export interface AuctionItem {
  auctionId: string;      // Changed from 'id' to match .NET DTO
  productName: string;    // Changed from 'title'
  startingPrice: number;  // Initial price from the product table
  endTime: string;        // ISO string from Supabase
  isClosed: boolean;
  currentBid?: number;    // Added to store live WebSocket updates
  bidderName?: string;
  description?: string;
}
