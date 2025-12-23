package com.wildocsai.backend.service;

import com.wildocsai.backend.dto.VerificationResponse;
import com.wildocsai.backend.entity.UserEntity;
import com.wildocsai.backend.entity.VerificationCodeEntity;
import com.wildocsai.backend.entity.VerificationType;
import com.wildocsai.backend.repository.UserRepository;
import com.wildocsai.backend.repository.VerificationCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmailService
{
    private final VerificationCodeRepository verificationCodeRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;

    // For generating unique verification codes
    private static final String CODE_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 8;

    public void sendVerificationEmail(String toEmail)
    {
        SimpleMailMessage message = new SimpleMailMessage();
        String verificationLink = "http://localhost:5173/verify";
        String verificationCode = generateUniqueVerificationCode();

        UserEntity user = userRepository.findByEmail(toEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + toEmail));

        VerificationCodeEntity verificationCodeEntity = new VerificationCodeEntity();
        verificationCodeEntity.setCode(verificationCode);
        verificationCodeEntity.setType(VerificationType.VERIFY_EMAIL);
        verificationCodeEntity.setUser(user);

        verificationCodeRepository.save(verificationCodeEntity);
        
        message.setTo(toEmail);
        message.setSubject("Wildocs AI: Verify Your Email");
        message.setText
        (
            "Welcome to Wildocs AI!\n\n" +
            "Use the verification code below to verify your email address:\n\n" +
            verificationCode + "\n\n" +
            "Enter code in the verification page: " + verificationLink
        );

        mailSender.send(message);
    }

    private String generateUniqueVerificationCode()
    {
        SecureRandom random = new SecureRandom();
        String code;

        do
        {
            StringBuilder sb = new StringBuilder(CODE_LENGTH);
            for (int i = 0; i < CODE_LENGTH; i++)
            {
                sb.append(CODE_CHARACTERS.charAt(random.nextInt(CODE_CHARACTERS.length())));
            }
            code = sb.toString();
        }
        while(verificationCodeRepository.findByCode(code).isPresent()); // Ensure the code is unique

        return code;
    }

    public VerificationResponse verifyEmail(String code)
    {
        VerificationCodeEntity verificationCodeEntity = verificationCodeRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Invalid verification code"));

        UserEntity user = verificationCodeEntity.getUser();

        if(user.isVerified())
        {
            throw new RuntimeException("Email is already verified");
        }

        user.setVerified(true);
        verificationCodeEntity.setVerifiedAt(LocalDateTime.now());
        userRepository.save(user);
        verificationCodeRepository.save(verificationCodeEntity);

        return new VerificationResponse
        (
            "Email verification successful! Redirecting to login...",
            user.getEmail(),
            user.isVerified(),
            verificationCodeEntity.getVerifiedAt()
        );
    }
}
