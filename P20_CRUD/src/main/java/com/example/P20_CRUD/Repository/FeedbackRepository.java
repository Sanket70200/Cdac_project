package com.example.P20_CRUD.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.P20_CRUD.Entity.Feedback;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {

	@Query("SELECT f FROM Feedback f WHERE f.packageid = :packageid ORDER BY f.createdAt DESC")
	public List<Feedback> getAllFeed(@Param("packageid")int packageid);

	@Query("SELECT f FROM Feedback f WHERE f.tourist_id = :userId AND f.packageid = :packageId")
	public Optional<Feedback> findUserFeedback(@Param("userId") int userId, @Param("packageId") int packageId);

}
