package com.example.P20_CRUD.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.P20_CRUD.Entity.Users;

import jakarta.transaction.Transactional;


@Repository
public interface User_Repository extends JpaRepository<Users, Integer>{

   @Query("SELECT count(*) from Users where username =:username")
   public int findByUsername(@Param("username")String username);

    
    @Query("Select u from Users u where u.role_id.role_id=:role_id")
    public List<Users> getAllUser(@Param("role_id")int role_id);


    @Transactional
	@Modifying
	@Query("UPDATE Users u SET u.accountstatus = 0 WHERE u.user_id = :uid")
	public int updateAccountStatus(@Param("uid") int uid); 

    @Query("Select count(*) from Users u where email=:em")
	public int findByEmail(@Param("em")String em);

    @Transactional
	@Modifying
	@Query("UPDATE Users u SET u.accountstatus = 1 WHERE u.user_id = :uid")
	public int ApproveCompany(int uid);

    @Transactional
	@Modifying
	@Query("UPDATE Users u SET u.firstname = :firstname, u.lastname=:lastname, u.email=:email, u.address=:address, u.contactno=:contactno WHERE u.username = :username")
	public int UpdateUser(String username, String firstname, String lastname, String email, 
			String address, String contactno);

    
	 	  
    

}

