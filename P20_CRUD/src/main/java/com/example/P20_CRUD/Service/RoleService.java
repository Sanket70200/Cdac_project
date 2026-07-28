package com.example.P20_CRUD.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.P20_CRUD.Entity.Role;
import com.example.P20_CRUD.Repository.Role_Repository;



@Service
public class RoleService {
	
	@Autowired
	Role_Repository Role_Repo;
	
	public Optional<Role> getRole(int rid)
	{
		return Role_Repo.findById(rid);
	}
	
	}

