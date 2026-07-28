package com.example.P20_CRUD.Repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.P20_CRUD.Entity.Tourist;


@Repository
public interface TouristRepository extends JpaRepository<Tourist, Integer> {
    // You can define custom query methods here if needed
	@Query("SELECT t.touristId FROM Tourist t WHERE t.tripId = :tripId AND t.userId = :userId")
	public List<Integer> findBookingIdByTripIdAndUserId(@Param("tripId") int tripId, @Param("userId") int userId);

}

