package com.example.P20_CRUD.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.P20_CRUD.Entity.AddToWishlist;
import com.example.P20_CRUD.Repository.AddToWishlistRepository;

@Service
public class AddToWishlistService {
	
	@Autowired
	AddToWishlistRepository wishRepo;

	public AddToWishlist saveAddToWishlist(AddToWishlist addToWishlist) {
		// TODO Auto-generated method stub
		return wishRepo.save(addToWishlist);
	}

	public void removeFromWishlist(int tripId, int i) {
		// TODO Auto-generated method stub
		int wishid= wishRepo.getWishid(tripId,i);
	    wishRepo.deleteById(wishid);
		
	}
	
	public boolean existsInWishlist(int tripId, int userId) {
	    return wishRepo.existsByTripIdAndUserId(tripId, userId);
	}

	

}
