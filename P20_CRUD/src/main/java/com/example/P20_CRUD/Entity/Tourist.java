package com.example.P20_CRUD.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "tourist")
@Data
public class Tourist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tourist_id")
    private Integer touristId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "age")
    private Integer age;

    @Column(name = "gender", length = 255)
    private String gender;

    @Column(name = "adhar_no", length = 255)
    private String adharNo;

    @Column(name = "trip_id", nullable = false)
    private Integer tripId;

    @Column(name = "firstname", length = 255, nullable = false)
    private String firstName;

    @Column(name = "lastname", length = 255, nullable = false)
    private String lastName;

}
