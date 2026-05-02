using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace OmniMarket.Gateway.Models
{
    [Table("auctions")]
    public class Auction : BaseModel
    {
        [PrimaryKey("id", false)]
        public Guid Id { get; set; }

        [Column("product_id")]
        public Guid ProductId { get; set; }

        [Column("end_time")]
        public DateTime EndTime { get; set; }

        [Column("is_closed")]
        public bool IsClosed { get; set; }
    }
}
