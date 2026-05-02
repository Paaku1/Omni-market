using Microsoft.AspNetCore.Mvc;
using OmniMarket.Gateway.DTO;
using OmniMarket.Gateway.Models;

namespace OmniMarket.Gateway.Controllers
{
    [Route("/api/bidding")]
    public class BiddingController(Supabase.Client _supabaseClient) : Controller
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
    }
}
