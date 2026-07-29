package com.example.P20_CRUD.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.P20_CRUD.Entity.Company;



@Repository
public interface CompanyRepository extends JpaRepository< Company, Integer> {

	@Query("SELECT c.company_id FROM Company c WHERE c.user_id.user_id = :userid")
	int getByUserId(@Param("userid")int userid);



	@Query("SELECT c FROM Company c WHERE c.user_id.accountstatus = 0")
	public List<Company> forapprove();

	@Query("SELECT c FROM Company c WHERE c.user_id.accountstatus = 1")
	public List<Company> foractive();


}