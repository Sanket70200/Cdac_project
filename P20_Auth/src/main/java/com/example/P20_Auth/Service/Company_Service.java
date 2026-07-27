package com.example.P20_Auth.Service;


import java.util.List;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.P20_Auth.Controller.Entity.Company;
import com.example.P20_Auth.Controller.Entity.Role;
import com.example.P20_Auth.Repository.CompanyRepository;
import com.example.P20_Auth.Repository.Role_Repository;
import com.example.P20_Auth.Repository.User_Repository;



@Service
public class Company_Service {

	@Autowired
	CompanyRepository ComRepo;
	
	@Autowired
	User_Repository User_repo;
	
	@Autowired
	Role_Repository Role_repo;
	

	public ResponseEntity<String> registerCompnay(Company com) {
		// TODO Auto-generated method stub
		if (User_repo.findByUsername(com.getUser_id().getUsername())>0) {
            return new ResponseEntity<>("Username already taken", HttpStatus.BAD_REQUEST);
        }
		if (User_repo.findByContact(com.getUser_id().getContactno()) > 0) {
            return new ResponseEntity<>("Contact No already register", HttpStatus.BAD_REQUEST);
        }
		// Save the new user
		 com.getUser_id().setFirstname("Company");
		 com.getUser_id().setLastname("Company");
		 Role role= Role_repo.findById(3).orElseThrow(() -> new RuntimeException("Role not found with ID: "));
		 com.getUser_id().setRole_id(role); // default Role_Id	       
         com.getUser_id().setAccountstatus(0);
         ComRepo.save(com);
        return new ResponseEntity<>("Compnay registered successfully", HttpStatus.OK);
	}

	
	
}

