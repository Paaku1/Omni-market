namespace OmniMarket.Gateway.DTO
{
    public class AuctionListItemDTO
    {
        public Guid AuctionId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal StartingPrice { get; set; }
        public DateTime EndTime { get; set; }
        public bool IsClosed { get; set; }
    }
}
