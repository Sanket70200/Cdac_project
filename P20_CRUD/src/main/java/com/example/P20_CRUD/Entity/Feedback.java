package com.example.P20_CRUD.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="feedback")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class Feedback {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer feedback_id;
	
	@Column(name="tourist_id")
	private int tourist_id;
	
	@Column(name="feedback_desc")
	private String feedback_desc;
	
	@Column(name="rating")
	private Integer rating;
	
    @Column(name="packageid")
	private int packageid;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    private void setCreatedAt() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

}

