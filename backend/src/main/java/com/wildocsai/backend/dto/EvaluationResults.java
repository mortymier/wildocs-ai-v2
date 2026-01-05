package com.wildocsai.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class EvaluationResults 
{
    @JsonProperty("Preface")
    private SimpleSectionEvaluation preface;

    @JsonProperty("Introduction")
    private DetailedSectionEvaluation introduction;

    @JsonProperty("Architectural_Design")
    private SimpleSectionEvaluation architecturalDesign;

    @JsonProperty("Detailed_Design")
    private DetailedSectionEvaluation detailedDesign;

    @JsonProperty("Total_Score")
    private int totalScore;
}
