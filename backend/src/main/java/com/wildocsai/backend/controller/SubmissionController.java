package com.wildocsai.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.wildocsai.backend.dto.EvaluationResults;
import com.wildocsai.backend.dto.SubmissionDetailsResponse;
import com.wildocsai.backend.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/submission")
@RequiredArgsConstructor
@Slf4j
public class SubmissionController
{
    private final SubmissionService submissionService;

    @PostMapping("/upload")
    public ResponseEntity<?> createSubmissionFromUpload
    (@RequestParam MultipartFile file, @RequestParam String email, @RequestParam String joinCode)
    {
        try
        {
            SubmissionDetailsResponse submission = submissionService.createSubmissionFromUpload(file, email, joinCode);
            return ResponseEntity.status(HttpStatus.CREATED).body(submission);
        }
        catch(RuntimeException e)
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/all/student-class")
    public ResponseEntity<?> getStudentSubmissionsInClass(@RequestParam String email, @RequestParam String joinCode)
    {
        try
        {
            List<SubmissionDetailsResponse> submissions = submissionService.getStudentSubmissionsInClass(email, joinCode);
            return ResponseEntity.ok(submissions);
        }
        catch(RuntimeException e)
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/evaluation-results")
    public ResponseEntity<?> getSubmissionEvaluationResults(@RequestParam String joinCode, @RequestParam Integer submissionNumber)
    {
        try
        {
            EvaluationResults results = submissionService.getSubmissionEvaluationResults(joinCode, submissionNumber);
            return ResponseEntity.ok(results);
        }
        catch(IllegalArgumentException e)
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        catch(JsonProcessingException e)
        {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteSubmission(@RequestParam String joinCode, @RequestParam Integer submissionNumber)
    {
        try
        {
            submissionService.deleteSubmission(joinCode, submissionNumber);
            return ResponseEntity.ok("Submission deleted successfully");
        }
        catch(RuntimeException e)
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
