package com.example.P20_CRUD.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.P20_CRUD.Entity.AddToCart;
import com.example.P20_CRUD.Repository.AddToCartRepository;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class AddToCartService {

	@Autowired
	AddToCartRepository carerepo;
	
	public AddToCart saveAddToCart(AddToCart addToCart) {
		System.out.println(addToCart.getTripId());
        return carerepo.save(addToCart);  // Save the AddToCart entity and return the saved entity
    }

	public void removeFromCart(int tripId, int userId) {
	    // Fetch the cart item ID based on tripId and userId
	    int cartId = carerepo.getCartId(tripId, userId);
	    
	    // Delete the cart item by its ID
	    carerepo.deleteById(cartId);
	}

	public boolean existsInCart(int tripId, int userId) {
	    return carerepo.existsByTripIdAndUserId(tripId, userId);
	}


}
