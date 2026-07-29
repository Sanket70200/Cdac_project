package com.example.P20_CRUD.Service;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.P20_CRUD.DummyUseEntities.FeedbackRequest;
import com.example.P20_CRUD.DummyUseEntities.FeedbackResponse;
import com.example.P20_CRUD.DummyUseEntities.FeedbackTripResponse;
import com.example.P20_CRUD.Entity.Booking;
import com.example.P20_CRUD.Entity.Feedback;
import com.example.P20_CRUD.Entity.Trips;
import com.example.P20_CRUD.Entity.Users;
import com.example.P20_CRUD.Repository.BookingRepository;
import com.example.P20_CRUD.Repository.FeedbackRepository;
import com.example.P20_CRUD.Repository.User_Repository;

import jakarta.transaction.Transactional;

@Service
public class FeedBackService {

	@Autowired
	FeedbackRepository FRepo;

	@Autowired
	BookingRepository bookingRepository;

	@Autowired
	User_Repository userRepository;
	

	public List<FeedbackResponse> getAllfeedback(int packageId) {
		return FRepo.getAllFeed(packageId).stream()
				.map(this::toFeedbackResponse)
				.toList();
	}

	public List<FeedbackTripResponse> getCompletedTripsForFeedback(int userId) {
		Map<Integer, FeedbackTripResponse> packages = new LinkedHashMap<>();

		for (Booking booking : bookingRepository.getBooking(userId)) {
			Trips trip = booking.getTrip_id();
			if (trip == null || trip.getPackageid() == null || trip.getEnd_date() == null
					|| trip.getEnd_date().isAfter(LocalDate.now())) {
				continue;
			}

			int packageId = trip.getPackageid().getPackageid();
			Feedback existingFeedback = FRepo.findUserFeedback(userId, packageId).orElse(null);
			packages.put(packageId, new FeedbackTripResponse(
					trip.getTrip_id(),
					packageId,
					trip.getPackageid().getPackage_name(),
					trip.getPackageid().getSource(),
					trip.getPackageid().getDestination(),
					trip.getEnd_date(),
					existingFeedback == null ? null : existingFeedback.getRating(),
					existingFeedback == null ? "" : existingFeedback.getFeedback_desc()
			));
		}

		return packages.values().stream().toList();
	}

	@Transactional
	public FeedbackResponse saveFeedback(FeedbackRequest request) {
		String feedbackText = request.getFeedbackDesc() == null ? "" : request.getFeedbackDesc().trim();

		if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
			throw new IllegalArgumentException("Please select a rating from 1 to 5.");
		}

		if (feedbackText.length() < 3 || feedbackText.length() > 255) {
			throw new IllegalArgumentException("Feedback must contain between 3 and 255 characters.");
		}

		Users user = userRepository.findById(request.getUserId())
				.orElseThrow(() -> new IllegalArgumentException("User account was not found."));

		boolean hasCompletedBooking = bookingRepository.getBooking(request.getUserId()).stream()
				.map(Booking::getTrip_id)
				.filter(trip -> trip != null && trip.getPackageid() != null && trip.getEnd_date() != null)
				.anyMatch(trip -> trip.getPackageid().getPackageid().equals(request.getPackageId())
						&& !trip.getEnd_date().isAfter(LocalDate.now()));

		if (!hasCompletedBooking) {
			throw new IllegalStateException("Feedback is available only after you complete this trip.");
		}

		Feedback feedback = FRepo.findUserFeedback(request.getUserId(), request.getPackageId())
				.orElseGet(Feedback::new);
		feedback.setTourist_id(request.getUserId());
		feedback.setPackageid(request.getPackageId());
		feedback.setRating(request.getRating());
		feedback.setFeedback_desc(feedbackText);

		return toFeedbackResponse(FRepo.save(feedback), user);
	}

	private FeedbackResponse toFeedbackResponse(Feedback feedback) {
		Users user = userRepository.findById(feedback.getTourist_id()).orElse(null);
		return toFeedbackResponse(feedback, user);
	}

	private FeedbackResponse toFeedbackResponse(Feedback feedback, Users user) {
		String reviewerName = user == null
				? "Traveller"
				: String.join(" ",
						user.getFirstname() == null ? "" : user.getFirstname(),
						user.getLastname() == null ? "" : user.getLastname()).trim();

		return new FeedbackResponse(
				feedback.getFeedback_id(),
				feedback.getPackageid(),
				feedback.getRating(),
				feedback.getFeedback_desc(),
				reviewerName.isBlank() ? "Traveller" : reviewerName,
				feedback.getCreatedAt()
		);
	}

	
}

