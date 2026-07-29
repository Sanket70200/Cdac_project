package com.example.P20_CRUD.DummyUseEntities;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FeedbackResponse {
    private Integer feedbackId;
    private int packageId;
    private Integer rating;
    private String feedbackDesc;
    private String reviewerName;
}
