package com.omnimarket.bidding.handler;

import com.omnimarket.bidding.model.Bid;
import com.omnimarket.bidding.repository.BidRepository;
import lombok.NonNull;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;
import tools.jackson.databind.ObjectMapper;

@Component
public class BiddingHandler implements WebSocketHandler {

    private final BidRepository bidRepository;
    private final ReactiveRedisTemplate<@NonNull String,@NonNull String> reactiveRedisTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Sinks.Many<@NonNull String> bidSink = Sinks.many().multicast().directBestEffort();

    public BiddingHandler(BidRepository bidRepository, ReactiveRedisTemplate<@NonNull String,@NonNull String> reactiveRedisTemplate) {
        this.bidRepository = bidRepository;
        this.reactiveRedisTemplate = reactiveRedisTemplate;
    }

    @Override
    public @NonNull Mono<@NonNull Void> handle(WebSocketSession session) {
        // OUTPUT: This sends messages FROM the megaphone TO the user
        Mono<@NonNull Void> output = session.send(bidSink.asFlux()
                .map(session::textMessage));

        // INPUT: This listens TO the user
        Mono<@NonNull Void> input = session.receive()
                .map(WebSocketMessage::getPayloadAsText)
                .flatMap(payload -> {
                    try {
                        Bid incomingBid = objectMapper.readValue(payload, Bid.class);
                        incomingBid.setCreatedAt(java.time.LocalDateTime.now());

                        return bidRepository.save(incomingBid)
                                .flatMap(savedBid -> {
                                    String announcement = "{\"type\": \"NEW_BID\", \"amount\": " + savedBid.getAmount() + "}";
                                    bidSink.tryEmitNext(announcement);
                                    return Mono.empty();
                                })
                                // SAFETY 1: If the Database fails (Wrong ID), send a message but don't close connection
                                .onErrorResume(e -> {
                                    return session.send(Mono.just(session.textMessage("DB Error: " + e.getMessage())));
                                });
                    } catch (Exception e) {
                        // SAFETY 2: If JSON is bad, tell the user, but keep the "Pipe" open
                        return session.send(Mono.just(session.textMessage("Invalid JSON: " + e.getMessage())));
                    }
                })
                .then();

        return Mono.zip(input, output).then();
    }
}
