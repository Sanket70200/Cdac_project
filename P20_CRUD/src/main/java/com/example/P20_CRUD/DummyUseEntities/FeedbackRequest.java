package com.example.P20_CRUD.DummyUseEntities;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FeedbackRequest {
    private int userId;
    private int packageId;
    private Integer rating;
    private String feedbackDesc;
}
