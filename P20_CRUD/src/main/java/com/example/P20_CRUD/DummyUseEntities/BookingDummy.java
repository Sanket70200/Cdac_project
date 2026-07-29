package com.example.P20_CRUD.DummyUseEntities;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingDummy {

    private int tripId;
    
    private int userId;
    private String paymentStatus;
    private int noOfBookings;
    private String amount;
}
