package com.example.P20_CRUD.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.P20_CRUD.Entity.Role;


@Repository
public interface Role_Repository extends JpaRepository <Role, Integer> {

}