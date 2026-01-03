package com.wildocsai.backend.controller;

import com.wildocsai.backend.dto.SubmissionDetailsResponse;
import com.wildocsai.backend.entity.SubmissionEntity;
import com.wildocsai.backend.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@RestController
@RequestMapping("/api/submission")
@RequiredArgsConstructor
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
}
