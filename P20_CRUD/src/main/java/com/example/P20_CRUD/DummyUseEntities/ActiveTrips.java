package com.example.P20_CRUD.DummyUseEntities;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ActiveTrips {
	private String package_name;
	private String description;
	private String source;
	private String destination;
	private float person_per_package;
	private String image_desc;
	private int company_id;
	private  Integer tourist_allowed;
	private Date start_date;
	private Date end_date;
}
