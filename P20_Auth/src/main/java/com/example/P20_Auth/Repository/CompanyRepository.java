package com.example.P20_Auth.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.P20_Auth.Controller.Entity.Company;


@Repository
public interface CompanyRepository extends JpaRepository< Company, Integer> {

}
