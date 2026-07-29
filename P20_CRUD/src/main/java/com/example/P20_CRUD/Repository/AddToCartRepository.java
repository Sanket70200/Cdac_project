package com.example.P20_CRUD.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.P20_CRUD.Entity.AddToCart;

@Repository
public interface AddToCartRepository extends JpaRepository<AddToCart, Integer> {

	@Query("SELECT c.cardId FROM AddToCart c WHERE c.tripId = :tripId AND c.userId = :userId")
    public int getCartId(@Param("tripId") int tripId, @Param("userId") int userId);

	@Query("SELECT COUNT(c) > 0 FROM AddToCart c WHERE c.tripId = :tripId AND c.userId = :userId")
    public boolean existsByTripIdAndUserId(@Param("tripId") int tripId, @Param("userId") int userId);


}