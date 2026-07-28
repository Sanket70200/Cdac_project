package com.example.P20_CRUD.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.P20_CRUD.DummyUseEntities.BookingDummy;
import com.example.P20_CRUD.DummyUseEntities.GetBooking;
import com.example.P20_CRUD.Entity.Booking;
import com.example.P20_CRUD.Entity.Trips;
import com.example.P20_CRUD.Repository.BookingRepository;
import com.example.P20_CRUD.Repository.Trips_Repo;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private Trips_Repo triprepo;

    public Booking saveBooking(BookingDummy booking) {
    	
    	Trips t1=triprepo.gettrip(booking.getTripId());
        Booking B1=new Booking();
        B1.setTrip_id(t1);
        B1.setAmount(booking.getAmount());
        B1.setNoOfBookings(booking.getNoOfBookings());
        B1.setPaymentStatus(booking.getPaymentStatus());
        B1.setUserId(booking.getUserId());
        return bookingRepository.save(B1);
    }


	public List<GetBooking> GetBookingDetails(int userid) {
		
		List<GetBooking> G1=new ArrayList<GetBooking>();
		
		List<Booking> B1=bookingRepository.getBooking(userid);
		for (Booking bk1 : B1)
		{
                GetBooking gb1=new GetBooking();
				gb1.setPackage_name(bk1.getTrip_id().getPackageid().getPackage_name());
				gb1.setSource(bk1.getTrip_id().getPackageid().getSource());
				gb1.setDestination(bk1.getTrip_id().getPackageid().getDestination());
				gb1.setDescription(bk1.getTrip_id().getPackageid().getDescription());
				gb1.setStart_date(bk1.getTrip_id().getStart_date());
				gb1.setEnd_date(bk1.getTrip_id().getEnd_date());
				gb1.setNoOfBookings(bk1.getNoOfBookings());
				gb1.setAmount(bk1.getAmount());
		
			G1.add(gb1);
		}	
		return G1;
	}
}