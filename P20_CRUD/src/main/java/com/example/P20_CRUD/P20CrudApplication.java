package com.example.P20_CRUD;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class P20CrudApplication {

	public static void main(String[] args) {
		SpringApplication.run(P20CrudApplication.class, args);
	}

}
