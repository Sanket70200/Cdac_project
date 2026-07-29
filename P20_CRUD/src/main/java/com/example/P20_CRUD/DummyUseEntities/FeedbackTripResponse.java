package com.example.P20_CRUD.DummyUseEntities;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FeedbackTripResponse {
    private Integer tripId;
    private int packageId;
    private String packageName;
    private String source;
    private String destination;
    private LocalDate endDate;
    private Integer rating;
    private String feedbackDesc;
}
