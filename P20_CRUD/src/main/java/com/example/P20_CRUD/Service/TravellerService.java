package com.example.P20_CRUD.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.P20_CRUD.DummyUseEntities.DummyTrav;
import com.example.P20_CRUD.Entity.Traveller;
import com.example.P20_CRUD.Repository.BookingRepository;
import com.example.P20_CRUD.Repository.TouristRepository;
import com.example.P20_CRUD.Repository.TravellerRepository;

@Service
public class TravellerService {

    @Autowired
    private TravellerRepository travellerRepository;
    
    @Autowired 
    private BookingRepository bookingrepo;
    
    @Autowired
    private TouristRepository touristrepo;
//
//    public String saveTraveller(DummyTrav dm) {
//    	
//    	int bookingid=bookingrepo.findBookingIdByTripIdAndUserId(dm.getTripId(), dm.getUserId());
//    	List<Integer> touristid=touristrepo.findBookingIdByTripIdAndUserId(dm.getTripId(),dm.getUserId());
//    	
//    	List<Traveller> travellers = new ArrayList<>();
//
//    	for (Integer touristId : touristid) {
//    	    Traveller traveller = new Traveller();
//    	    traveller.setBookingId(bookingid);
//    	    traveller.setTouristId(touristId);
//    	    
//    	    // Set other traveller details if required
//    	    travellers.add(traveller);
//    	}
//    	travellerRepository.saveAll(travellers);
//		return "Travellers saved successfully!";
//         
//    	
//    	
//    }
    }
