package com.example.P20_CRUD.DummyUseEntities;


import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class AddTrips {

	private int packageid;
	
	private LocalDate startDate; 
	
	private LocalDate endDate; 
	
	private int touristAllowed;
	
	private int trips_P;
}
