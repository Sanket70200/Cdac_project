package com.example.P20_CRUD.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.P20_CRUD.Entity.AddToWishlist;

@Repository
public interface AddToWishlistRepository extends JpaRepository<AddToWishlist, Integer> {

	@Query("SELECT w.wishId FROM AddToWishlist w WHERE w.tripId = :tripId and w.userId=:i")
	public int getWishid(int tripId, int i);
    // You can add custom query methods here if necessary
	
	 @Query("SELECT COUNT(w) > 0 FROM AddToWishlist w WHERE w.tripId = :tripId AND w.userId = :userId")
	 public boolean existsByTripIdAndUserId(@Param("tripId") int tripId, @Param("userId") int userId);
}

