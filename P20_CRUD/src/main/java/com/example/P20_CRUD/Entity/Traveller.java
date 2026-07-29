package com.example.P20_CRUD.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "traveller")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Traveller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Traveller_ID")
    private int travellerId;

    @Column(name = "Tourist_ID")
    private int touristId;

    @Column(name = "Booking_ID")
    private int bookingId;
}

