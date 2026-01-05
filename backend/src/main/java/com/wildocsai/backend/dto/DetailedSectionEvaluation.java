package com.wildocsai.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

// This DTO is for the Introduction and Detailed Design sections which has multiple subsections

@Data
public class DetailedSectionEvaluation 
{
    @JsonProperty("Score")
    private int score;

    @JsonProperty("Strengths")
    private String strenghts;

    @JsonProperty("Weaknesses")
    private String weaknesses;

    @JsonProperty("Suggestions")
    private String suggestions;
}
