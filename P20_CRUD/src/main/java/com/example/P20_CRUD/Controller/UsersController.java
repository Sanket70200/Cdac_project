package com.example.P20_CRUD.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.P20_CRUD.DummyUseEntities.AvailabilityRequest;
import com.example.P20_CRUD.DummyUseEntities.BookingDummy;
import com.example.P20_CRUD.DummyUseEntities.BookingRequest;
import com.example.P20_CRUD.DummyUseEntities.DummyTrav;
import com.example.P20_CRUD.DummyUseEntities.FeedbackRequest;
import com.example.P20_CRUD.DummyUseEntities.FeedbackResponse;
import com.example.P20_CRUD.DummyUseEntities.FeedbackTripResponse;
import com.example.P20_CRUD.DummyUseEntities.DummyUser;
import com.example.P20_CRUD.DummyUseEntities.GetBooking;
import com.example.P20_CRUD.DummyUseEntities.GetCompnayId;
import com.example.P20_CRUD.DummyUseEntities.OtpRequest;
import com.example.P20_CRUD.DummyUseEntities.RegistrationRequest;
import com.example.P20_CRUD.DummyUseEntities.UpdateTouristRequest;
import com.example.P20_CRUD.DummyUseEntities.UserRequest;
import com.example.P20_CRUD.Entity.AddToCart;
import com.example.P20_CRUD.Entity.AddToWishlist;
import com.example.P20_CRUD.Entity.Booking;
import com.example.P20_CRUD.Entity.Tourist;
import com.example.P20_CRUD.Entity.Traveller;
import com.example.P20_CRUD.Entity.Trips;
import com.example.P20_CRUD.Service.AddToCartService;
import com.example.P20_CRUD.Service.AddToWishlistService;
import com.example.P20_CRUD.Service.BookingService;
import com.example.P20_CRUD.Service.EmailService;
import com.example.P20_CRUD.Service.FeedBackService;
import com.example.P20_CRUD.Service.OtpService;
import com.example.P20_CRUD.Service.TouristService;
import com.example.P20_CRUD.Service.TravellerService;
import com.example.P20_CRUD.Service.Trips_Service;
import com.example.P20_CRUD.Service.UsersService;



@RestController
@RequestMapping("/crud")
public class UsersController {

	@Autowired
	UsersService Userser;
	
	@Autowired
	Trips_Service tser;
	
	@Autowired
	TouristService toservice;
	
	@Autowired
	AddToCartService cardservice;
	
	@Autowired
	AddToWishlistService wishservice;
	
	@Autowired
	BookingService bookser;
	
	@Autowired
    private TravellerService travellerService;

	@Autowired
	OtpService otser;
	
	@Autowired
    EmailService emailService;
	
	@Autowired
	BookingService bookservice;

	@Autowired
	FeedBackService feedbackService;

	
	@GetMapping("/gettripsforuser")
	public List<Trips> getTripsforuser()
	{
		return tser.getallTripsUser(); 
	}
	 
	
	 @PostMapping("/savetorist")
	 public List<Tourist> saveMultipleTourists(@RequestBody List<Tourist> tourists) {
	        return toservice.saveMultipleTourists(tourists);
	 }
	 
	 
	 @PostMapping("/addtocart")
	    public ResponseEntity<?> addToCart(@RequestBody AddToCart addToCart) {
	        System.out.println("Received Trip ID: " + addToCart.getTripId());
	        try {
	            AddToCart savedAddToCart = cardservice.saveAddToCart(addToCart);
	            return ResponseEntity.ok(savedAddToCart); 
	        } catch (Exception e) {
	            System.err.println("Error adding to cart: " + e.getMessage());
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                                 .body("Failed to add to cart: " + e.getMessage());
	        }
	    }
	 
	 @PostMapping("/addtowishlist")
	 public ResponseEntity<?> addToWishlist(@RequestBody AddToWishlist addToWishlist) {
	     System.out.println("Received Trip ID: " + addToWishlist.getTripId());
	     try {
	         AddToWishlist savedAddToWishlist =  wishservice.saveAddToWishlist(addToWishlist);
	         return ResponseEntity.ok(savedAddToWishlist);
	     } catch (Exception e) {
	         System.err.println("Error adding to wishlist: " + e.getMessage());
	         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                              .body("Failed to add to wishlist: " + e.getMessage());
	     }
	 }
	 
	 @PostMapping("/getwishlist")
	    public ResponseEntity<List<Trips>> getWishlist(@RequestBody UserRequest userRequest) {
	        try {
	            List<Trips> wishlist = tser.getWishlistByUserId(userRequest.getUserId());
	            if (wishlist == null || wishlist.isEmpty()) {
	                return new ResponseEntity<>(HttpStatus.NO_CONTENT); // No content if wishlist is empty
	            }
	            return new ResponseEntity<>(wishlist, HttpStatus.OK); // Return wishlist with OK status
	        } catch (Exception e) {
	            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // Internal server error in case of exception
	        }
	    }
	 
	 @PostMapping("/getcart")
	    public ResponseEntity<List<Trips>> getCart(@RequestBody UserRequest userRequest) {
	        try {
	            List<Trips> wishlist = tser.getCartByUserId(userRequest.getUserId());
	            System.out.println(userRequest.getUserId());
	            if (wishlist == null || wishlist.isEmpty()) {
	                return new ResponseEntity<>(HttpStatus.NO_CONTENT); // No content if wishlist is empty
	            }
	            return new ResponseEntity<>(wishlist, HttpStatus.OK); // Return wishlist with OK status
	        } catch (Exception e) {
	            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // Internal server error in case of exception
	        }
	    }
	 
	 @PostMapping("/checkAvailability")
	    public ResponseEntity<String> checkAvailability(@RequestBody AvailabilityRequest request) {
	        boolean isAvailable = tser.checkTripAvailability(request.getTripId(), request.getQuantity());
	        
	        if (isAvailable) {
	            return ResponseEntity.ok("Seats are available");
	        } else {
	            return ResponseEntity.badRequest().body("Insufficient seats available");
	        }
	    }
	 
	 @PostMapping("/removecart")
	 public ResponseEntity<String> removeFromCart(@RequestBody AddToWishlist request) {
	     try {
	    	 cardservice.removeFromCart(request.getTripId(), request.getUserId());
	         return ResponseEntity.ok("Trip removed from cart successfully!");
	     } catch (Exception e) {
	         return ResponseEntity.status(500).body("Failed to remove from cart: " + e.getMessage());
	     }
	 }

	 @PostMapping("/existsincart")
	    public ResponseEntity<Boolean> checkIfTripExistsInCart(@RequestBody AddToWishlist request) {
	        boolean exists = cardservice.existsInCart(request.getTripId(), request.getUserId());
	        return ResponseEntity.ok(exists);
	    }
	 
	 @PostMapping("/existsinwishlist")
	    public ResponseEntity<Boolean> checkIfTripExistsInWishlist(@RequestBody AddToWishlist request) {
	        boolean exists = wishservice.existsInWishlist(request.getTripId(), request.getUserId());
	        return ResponseEntity.ok(exists);
	    }
	 
	 @PostMapping("/removewishlist")
	 public ResponseEntity<String> removeFromWishlist(@RequestBody AddToWishlist wishlist) {
	     try {
	         wishservice.removeFromWishlist(wishlist.getTripId(), wishlist.getUserId());
	         return ResponseEntity.ok("Trip removed from wishlist successfully!");
	     } catch (Exception e) {
	         return ResponseEntity.status(500).body("Failed to remove from wishlist: " + e.getMessage());
	     }
	 }
	 
	 @PostMapping("/savebooking")
	    public Booking saveBooking(@RequestBody BookingDummy  booking) {
	        return bookser.saveBooking(booking);
	    }
	 
	 
	 @PutMapping("/updateTouristAllowed")
	 public ResponseEntity<String> updateTouristAllowed(@RequestBody UpdateTouristRequest request) {
	     boolean isUpdated = tser.updateTouristAllowed(request.getTripId(), request.getNumTourists());

	     if (isUpdated) {
	         return ResponseEntity.ok("Tourist allowed count updated successfully.");
	     } else {
	         return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Trip not found or update failed.");
	     }
	 }
	 
	    @PostMapping("/sendotp")
	    public String sendOtp(@RequestBody OtpRequest request) {
	    	otser.sendOtp(request.getEmail());
	        return "OTP sent successfully to " + request.getEmail();
	    }

	    // Endpoint to validate OTP (Request Body)
	    @PostMapping("/validate")
	    public String validateOtp(@RequestBody OtpRequest request) {
	        if (otser.validateOtp(request.getEmail(), request.getOtp())) {
	            return "OTP validated successfully!";
	        } else {
	            return "Invalid OTP. Please try again.";
	        }
	    }
	    
	    @PostMapping("/send-registration-confirmation")
	    public ResponseEntity<String> sendRegistrationConfirmation(@RequestBody RegistrationRequest request) {
	        emailService.sendRegistrationConfirmation(request.getEmail(), request.getUserName());
	        return ResponseEntity.ok("Registration confirmation email sent successfully!");
	    }
	    
	    @PostMapping("/send-booking-confirmation")
	    public ResponseEntity<String> sendBookingConfirmation(@RequestBody BookingRequest request) {
	        emailService.sendBookingConfirmation(request.getEmail(), request.getUserName(), request.getTripDetails());
	        return ResponseEntity.ok("Booking confirmation email sent successfully!");
	    }

	    @PostMapping("/getbooking")
	    public List<GetBooking> getBokking(@RequestBody GetCompnayId com)
	    {
	    	return bookservice.GetBookingDetails(com.getUserid());
	    }
	    
	 @PutMapping("/updateprofile")
	 public int updateProfilr(@RequestBody DummyUser dm)
	 {
	 	return Userser.UpdateProfile(dm);
	 }


	 @PostMapping("/feedback/eligible-trips")
	 public List<FeedbackTripResponse> getCompletedTripsForFeedback(@RequestBody UserRequest request) {
	 	return feedbackService.getCompletedTripsForFeedback(request.getUserId());
	 }

	 @PostMapping("/feedback")
	 public ResponseEntity<?> submitFeedback(@RequestBody FeedbackRequest request) {
	 	try {
	 		FeedbackResponse savedFeedback = feedbackService.saveFeedback(request);
	 		return ResponseEntity.status(HttpStatus.CREATED).body(savedFeedback);
	 	} catch (IllegalArgumentException exception) {
	 		return ResponseEntity.badRequest().body(Map.of("message", exception.getMessage()));
	 	} catch (IllegalStateException exception) {
	 		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", exception.getMessage()));
	 	}
	 }
	 
	 
	
}
