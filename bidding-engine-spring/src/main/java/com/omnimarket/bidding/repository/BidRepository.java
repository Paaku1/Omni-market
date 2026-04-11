package com.omnimarket.bidding.repository;

import com.omnimarket.bidding.model.Bid;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

import java.util.UUID;

public interface BidRepository extends ReactiveCrudRepository<Bid, UUID> {
    Flux<Bid> findByAuctionId(UUID auctionId);
}
