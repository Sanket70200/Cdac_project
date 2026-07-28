package com.example.P20_Discovery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class P20DiscoveryApplication {
	
		
	public static void main(String[] args) {
		SpringApplication.run(P20DiscoveryApplication.class, args);
	}

}
