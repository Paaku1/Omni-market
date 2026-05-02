export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  bidderName: string;
  endTime: Date;
  imageUrl: string;
}
