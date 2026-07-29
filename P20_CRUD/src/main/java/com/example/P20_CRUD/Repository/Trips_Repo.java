package com.example.P20_CRUD.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.P20_CRUD.Entity.Trips;

import jakarta.transaction.Transactional;


@Transactional
@Repository
public interface Trips_Repo extends JpaRepository<Trips, Integer> {

	 @Query("Select t from Trips t where t.trips_status=1")
	 public List<Trips> getAllTrips();

	
	 @Modifying
	 @Query("update Trips set trips_status=0 where trip_id =:tid")
	 public int Updatetrip(@Param("tid")int tid);

	 @Query("Select t from Trips t where t.trips_status = 1 and t.packageid.packageid in :pid")
	 public List<Trips> getTrips(@Param("pid") int[] pid);


	@Query("Select t from Trips t where t.trips_status = 1 and t.trip_id in (select w.tripId from AddToWishlist w where w.userId=:userId)")
	public List<Trips> gettripsforwishlist(int userId);


	@Query("Select t from Trips t where t.trips_status = 1 and t.trip_id in (select w.tripId from AddToCart w where w.userId=:userId)")
	public List<Trips> gettripsforcartlist(int userId);


	@Query("Select t.tourist_allowed- :quantity from Trips t where t.trips_status=1 and t.trip_id=:tripId")
	public int checkavaible(int tripId, int quantity);


	@Query("Select t from Trips t where t.trip_id=:tripId")
	public Trips gettrip(int tripId);





}
