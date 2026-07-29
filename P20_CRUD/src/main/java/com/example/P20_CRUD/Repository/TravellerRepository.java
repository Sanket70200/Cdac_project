package com.example.P20_CRUD.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.P20_CRUD.Entity.Traveller;

@Repository
public interface TravellerRepository extends JpaRepository<Traveller, Integer> {
}
