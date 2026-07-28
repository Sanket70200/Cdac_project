package com.example.P20_CRUD.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.P20_CRUD.Entity.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
	
//	    @Query("SELECT b.bookingId FROM Booking b WHERE b.tripId = :tripId AND b.userId = :userId")
//	    public int findBookingIdByTripIdAndUserId(int tripId, int userId);

	    @Query("SELECT b FROM Booking b WHERE b.userId = :userid")
		public List<Booking> getBooking(int userid);

	

}
