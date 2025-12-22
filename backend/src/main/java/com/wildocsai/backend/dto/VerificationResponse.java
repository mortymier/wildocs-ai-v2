package com.wildocsai.backend.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VerificationResponse 
{
    private String message;
    private String email;
    private boolean verified;
    private LocalDateTime verifiedAt;
}
