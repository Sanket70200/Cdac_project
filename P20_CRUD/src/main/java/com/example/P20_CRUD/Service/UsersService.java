package com.example.P20_CRUD.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.P20_CRUD.DummyUseEntities.DummyUser;
import com.example.P20_CRUD.Entity.Role;
import com.example.P20_CRUD.Entity.Users;
import com.example.P20_CRUD.Repository.Role_Repository;
import com.example.P20_CRUD.Repository.User_Repository;

import jakarta.transaction.Transactional;




@Service
@Transactional
public class UsersService {

	@Autowired
	User_Repository User_repo;
	
	@Autowired
	Role_Repository Role_repo;


           
		public List<Users> getAllUsers() {
			// TODO Auto-generated method stub
			return User_repo.getAllUser(2);
		}

		public int deleteUser(int uid) {
			// TODO Auto-generated method stub
			return User_repo.updateAccountStatus(uid);
		}

		public int findUserByEmail(String email) {
	        return User_repo.findByEmail(email);  // Assuming a method in the repository
	    }

		public int AppoveUser(int companyId) {
			// TODO Auto-generated method stub
			return User_repo.ApproveCompany(companyId);
		}

		public int UpdateProfile(DummyUser dm) {
			// TODO Auto-generated method stub
			return User_repo.UpdateUser(dm.getUsername(),dm.getFirstname(),dm.getLastname(),dm.getEmail(),dm.getAddress(),dm.getContactno());
		}

		

		
	}
	

