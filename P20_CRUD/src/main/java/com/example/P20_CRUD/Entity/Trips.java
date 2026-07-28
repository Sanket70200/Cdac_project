package com.example.P20_CRUD.Entity;

import java.time.LocalDate;


import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="trips")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class Trips {
  
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer trip_id;
	
	@ManyToOne(cascade = CascadeType.ALL)
	@JoinColumn(name="packageid")
	Trips_Package packageid ;
	
	@Column(name="start_date")
	private LocalDate start_date;
	
	@Column(name="end_date")
	private LocalDate end_date;
	
	@Column(name="trips_status")
	private int trips_status;
	
	@Column(name="tourist_allowed")
	private int tourist_allowed;
	
	
}

