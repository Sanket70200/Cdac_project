package com.example.P20Gateway;

import java.util.List;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
public class MyBeans {
    
    @Bean
    CorsWebFilter corsWebFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowCredentials(true);
        config.setAllowedOriginPatterns(List.of("http://localhost:3020")); // Use setAllowedOriginPatterns instead
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setExposedHeaders(List.of("Authorization"));
        
        source.registerCorsConfiguration("/**", config);
        return new CorsWebFilter(source);
    }
    
    @Bean
    RouteLocator customRouterLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("P20AUTH", r -> r.path("/auth/**").uri("lb://P20AUTH"))
            .route("P20ADMIN", r -> r.path("/admin/**").uri("lb://P20ADMIN"))
            .route("P20_CRUD", r -> r.path("/crud/**").uri("http://localhost:8203"))
            .build();
    }
}
