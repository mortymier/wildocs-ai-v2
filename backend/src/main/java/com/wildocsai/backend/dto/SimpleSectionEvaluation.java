package com.wildocsai.backend.dto;

// This DTO is for the Preface and Architectural Design sections

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class SimpleSectionEvaluation 
{
    @JsonProperty("Score")
    private int score;

    @JsonProperty("General_Evaluation")
    private String generalEvaluation;
}
