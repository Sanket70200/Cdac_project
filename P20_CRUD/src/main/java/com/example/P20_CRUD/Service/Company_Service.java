package com.example.P20_CRUD.Service;


import java.util.List;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.P20_CRUD.Entity.Company;
import com.example.P20_CRUD.Entity.Role;
import com.example.P20_CRUD.Repository.CompanyRepository;
import com.example.P20_CRUD.Repository.Role_Repository;
import com.example.P20_CRUD.Repository.User_Repository;


@Service
public class Company_Service {

	@Autowired
	CompanyRepository ComRepo;
	
	@Autowired
	User_Repository User_repo;
	
	@Autowired
	Role_Repository Role_repo;
	
	public List<Company> getforApprove(){
		return ComRepo.forapprove();
	}


	public int getallCompany(int userid) {
		// TODO Auto-generated method stub
		return ComRepo.getByUserId(userid);
	}

	public List<Company> getallactiveCompnies() {
		// TODO Auto-generated method stub
		return ComRepo.foractive();
	}

	
}

