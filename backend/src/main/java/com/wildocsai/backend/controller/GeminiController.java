package com.wildocsai.backend.controller;

import com.wildocsai.backend.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gemini")
@RequiredArgsConstructor
public class GeminiController
{
    private final GeminiService geminiService;

    @GetMapping("/ask")
    public String askGemini(@RequestBody String prompt)
    {
        return geminiService.askGemini(prompt);
    }

    @PostMapping("/evaluate")
    public ResponseEntity<?> evaluateSDD(@RequestParam String joinCode, @RequestParam Integer submissionNumber)
    {
        try
        {
            String result = geminiService.evaluateSDD(joinCode, submissionNumber);
            return ResponseEntity.ok(result);
        }
        catch(IllegalArgumentException e)
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        catch(Exception e)
        {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
