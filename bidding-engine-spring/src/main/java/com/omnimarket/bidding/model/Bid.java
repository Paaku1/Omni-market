package com.omnimarket.bidding.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column; // Add this import
import org.springframework.data.relational.core.mapping.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Table("bids")
public class Bid {
    @Id
    private UUID id;

    @Column("auction_id") // Maps Java 'auctionId' to DB 'auction_id'
    private UUID auctionId;

    @Column("bidder_id")  // Maps Java 'bidderId' to DB 'bidder_id'
    private UUID bidderId;

    private BigDecimal amount;

    @Column("created_at") // Maps Java 'createdAt' to DB 'created_at'
    private LocalDateTime createdAt;
}