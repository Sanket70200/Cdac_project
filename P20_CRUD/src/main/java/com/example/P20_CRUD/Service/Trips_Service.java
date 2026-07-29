package com.example.P20_CRUD.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.P20_CRUD.DummyUseEntities.AddTrips;
import com.example.P20_CRUD.DummyUseEntities.GetCompnayId;
import com.example.P20_CRUD.DummyUseEntities.PackageIDDummy;
import com.example.P20_CRUD.Entity.Trips;
import com.example.P20_CRUD.Entity.Trips_Package;
import com.example.P20_CRUD.Repository.Trips_Package_Repository;
import com.example.P20_CRUD.Repository.Trips_Repo;


@Service
public class Trips_Service {

	@Autowired
	Trips_Repo Trepo;
	
	@Autowired
	Trips_Package_Repository TPRepo;
	
	
	public List<Trips> getallTrips()
	{
		return Trepo.getAllTrips();
	}

	public int deletrip(int tid) {
		// TODO Auto-generated method stub
		return Trepo.Updatetrip(tid);
		
	}

	public String newTrips(AddTrips t) {
		// TODO Auto-generated method stub
		Trips t1=new Trips();
		Trips_Package Tp=TPRepo.findPackage(t.getPackageid());
		t1.setEnd_date(t.getEndDate());
		t1.setPackageid(Tp);
		t1.setStart_date(t.getStartDate());
		t1.setTourist_allowed(t.getTouristAllowed());
		t1.setTrips_status(1);
		System.err.println(t1);
		Trepo.save(t1);
		return "1";
	}

	public List<Trips> getTrips(GetCompnayId com) {
		int[] packageid=TPRepo.getPackageid(com.getUserid());
		return Trepo.getTrips(packageid) ;
	}

	
	public List<Trips> getallTripsUser() {
		// TODO Auto-generated method stub
		return Trepo.getAllTrips();
	}

	public List<Trips> getWishlistByUserId(int userId) {
		// TODO Auto-generated method stub
		return Trepo.gettripsforwishlist(userId);
	}

	public List<Trips> getCartByUserId(int userId) {
		// TODO Auto-generated method stub
		System.out.println(Trepo.gettripsforcartlist(userId));;
		return Trepo.gettripsforcartlist(userId);
	}

	public boolean checkTripAvailability(int tripId, int quantity) {
		// TODO Auto-generated method stub
		int avaible=Trepo.checkavaible(tripId,quantity);
		System.out.println(avaible);
		if(avaible >= quantity)
	    {
	        return true;
	    }
		return false;
	}
	
	
	public boolean updateTouristAllowed(Integer tripId, Integer numTourists) {
        Optional<Trips> optionalTrip = Trepo.findById(tripId);

        if (optionalTrip.isPresent()) {
            Trips trip = optionalTrip.get();
            int updatedCount = trip.getTourist_allowed() - numTourists;
            
            // Ensure tourist count doesn't go negative
            if (updatedCount < 0) {
                return false;
            }

            trip.setTourist_allowed(updatedCount);
            Trepo.save(trip);
            return true;
        }
        return false;
    }

	
	
	
}
