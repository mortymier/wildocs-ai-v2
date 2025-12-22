package com.wildocsai.backend.controller;

import com.wildocsai.backend.dto.RegisterRequest;
import com.wildocsai.backend.dto.VerificationResponse;
import com.wildocsai.backend.entity.UserRole;
import com.wildocsai.backend.service.AuthService;
import com.wildocsai.backend.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController
{
    private final AuthService authService;
    private final EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request, @RequestParam UserRole role)
    {
        try
        {
            String response = authService.register(request, role);
            emailService.sendVerificationEmail(request.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }
        catch(RuntimeException e)
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestParam String code)
    {
        try
        {
            VerificationResponse response = emailService.verifyEmail(code);
            return ResponseEntity.ok(response);
        }
        catch(RuntimeException e)
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
