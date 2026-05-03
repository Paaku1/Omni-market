using Microsoft.AspNetCore.Mvc;
using OmniMarket.Gateway.DTO;
using OmniMarket.Gateway.Models;

namespace OmniMarket.Gateway.Controllers
{
    [Route("/api/bidding")]
    [ApiController] // Recommended for better error handling in APIs
    public class BiddingController(Supabase.Client _supabaseClient) : ControllerBase
    {
        [HttpGet("products")]
        public async Task<IActionResult> GetProducts()
        {
            var response = await _supabaseClient.From<Product>().Get();
            var productDtos = response.Models.Select(p => new ProductDTO
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                StartingPrice = p.StartingPrice,
                SellerId = p.SellerId,
                CreatedAt = p.CreatedAt,
            }).ToList();
            return Ok(productDtos);
        }

        [HttpGet("active-auctions")]
        public async Task<IActionResult> GetActiveAuctions()
        {
            // The [Reference] attribute in the Auction model handles the join
            var response = await _supabaseClient
                .From<Auction>()
                .Select("*")
                .Get();

            var list = response.Models.Select(a => new AuctionListItemDTO
            {
                AuctionId = a.Id,
                ProductName = a.Product?.Name ?? "Unknown Item",
                StartingPrice = a.Product?.StartingPrice ?? 0,
                EndTime = a.EndTime,
                IsClosed = a.IsClosed
            }).ToList();

            return Ok(list);
        }

        [HttpGet("details/{auctionId}")]
        public async Task<IActionResult> GetAuctionDetails(Guid auctionId)
        {
            // FIX: Convert auctionId to string to prevent "Unknown criterion type" error
            var response = await _supabaseClient
                .From<Auction>()
                .Filter("id", Supabase.Postgrest.Constants.Operator.Equals, auctionId.ToString())
                .Select("*")
                .Single();

            if (response == null) return NotFound();

            var details = new AuctionDetailsDTO
            {
                AuctionId = response.Id,
                ProductName = response.Product?.Name ?? "Unknown Item",
                Description = response.Product?.Description,
                StartingPrice = response.Product?.StartingPrice ?? 0,
                EndTime = response.EndTime,
                IsClosed = response.IsClosed,
                // Maps the relationship seen in image_96c556.png
                BidHistory = response.Bids?.Select(b => new BidDTO
                {
                    Amount = b.Amount,
                    CreatedAt = b.CreatedAt,
                    BidderId = b.BidderId
                }).OrderByDescending(x => x.Amount).ToList() ?? new List<BidDTO>()
            };

            return Ok(details);
        }
    }
}