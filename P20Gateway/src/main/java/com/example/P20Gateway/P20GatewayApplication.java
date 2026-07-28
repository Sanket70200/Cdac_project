package com.example.P20Gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@EnableDiscoveryClient
@CrossOrigin(origins = "http://localhost:3020")
public class P20GatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(P20GatewayApplication.class, args);
	}

}
