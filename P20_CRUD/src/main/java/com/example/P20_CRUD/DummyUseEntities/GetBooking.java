package com.example.P20_CRUD.DummyUseEntities;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GetBooking {

	private String package_name;
	private String source;
	private String destination;
	private String description;
	private LocalDate start_date;
	private LocalDate end_date;
	private int noOfBookings;
	private String amount;
}
