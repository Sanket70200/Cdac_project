package com.example.P20_CRUD.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="package")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class Trips_Package {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer packageid;
	
	@Column(name="package_name")
	private String package_name;
	
	
	
	@Column(name="description",columnDefinition = "TEXT")
	private String description;
	
	@Column(name="source")
	private String source;
	
	@Column(name="destination")
	private String destination;
	
	@Column(name="person_per_package")
	private Float person_per_package;
	
	@Column(name="image_desc",columnDefinition = "TEXT")
	private String image_desc;
	
	@Column(name="company_id")
	private int company_id;
	
	@Column(name="package_status")
	private int package_status;
	
//	@JsonIgnoreProperties("packageid")
//	@OneToMany(mappedBy = "packageid", cascade = CascadeType.ALL)
//	List<Feedback> feedback;
//	
//	@JsonIgnoreProperties("packageid")
//	@OneToMany(mappedBy = "packageid", cascade = CascadeType.ALL)
//	List<Trip> trips;
	
}
