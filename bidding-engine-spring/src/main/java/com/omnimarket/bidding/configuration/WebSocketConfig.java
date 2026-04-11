package com.omnimarket.bidding.configuration;

import com.omnimarket.bidding.handler.BiddingHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.reactive.HandlerMapping;
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping;
import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter;

import java.util.Map;

@Configuration
public class WebSocketConfig {

    @Bean
    public HandlerMapping handleMapping(BiddingHandler biddingHandler){
        SimpleUrlHandlerMapping mapping = new SimpleUrlHandlerMapping();
        mapping.setUrlMap(Map.of("/ws/bids", biddingHandler));
        mapping.setOrder(-1);
        mapping.setCorsConfigurations(Map.of("*", new CorsConfiguration().applyPermitDefaultValues())); // Add this!
        return mapping;
        // return new SimpleUrlHandlerMapping(Map.of("/ws/bids",biddingHandler), -1);
    }

    @Bean
    public WebSocketHandlerAdapter handlerAdapter(){
        return new WebSocketHandlerAdapter();
    }
}
