package com.wildocsai.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SubmissionDetailsResponse 
{
    private Integer submissionNumber;
    private String fileName;
    private String fileExtension;
    private String content;
    private String teacherFeedback;
    private Boolean thumbsUp;
    private Boolean isEvaluated;
    private LocalDateTime submittedAt;
    private String studentName;
    private String studentEmail;
    private String className;
    private String classJoinCode;
}
