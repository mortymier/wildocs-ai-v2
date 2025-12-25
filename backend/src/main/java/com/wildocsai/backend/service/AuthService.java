package com.wildocsai.backend.service;

import com.wildocsai.backend.dto.LoginRequest;
import com.wildocsai.backend.dto.LoginResponse;
import com.wildocsai.backend.dto.RegisterRequest;
import com.wildocsai.backend.dto.UserDetailsResponse;
import com.wildocsai.backend.entity.UserEntity;
import com.wildocsai.backend.entity.UserRole;
import com.wildocsai.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService
{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request)
    {
        // Check if user exists
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // Check if password matches
        if(!passwordEncoder.matches(request.getPassword(), user.getPassword()))
        {
            throw new RuntimeException("Invalid credentials");
        }

        // Check if email is verified
        if(!user.isVerified())
        {
            throw new RuntimeException("Email is not yet verified. Please verify to login");
        }

        return new LoginResponse
        (
            "Login successful!", 
            user.getFirstName(), 
            user.getLastName(), 
            user.getEmail(), 
            user.getIdNum(),
            user.getRole().name()
        );
    }

    public String register(RegisterRequest request, UserRole role)
    {
        // Check if ID number is already used
        if(userRepository.existsByIdNum(request.getIdNum()))
        {
            throw new RuntimeException("ID number is already used");
        }

        // Check if email is already used
        if(userRepository.existsByEmail(request.getEmail()))
        {
            throw new RuntimeException("Email is already used");
        }

        // Map DTO to entity
        UserEntity user = new UserEntity();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setIdNum(request.getIdNum());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        // Save user in database
        userRepository.save(user);

        return "Registration successful for " + 
                user.getFirstName() + " " + user.getLastName() + "!"
                + " Please check your email for verification.";
    }

    public UserDetailsResponse getCurrentUser()
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication == null || !authentication.isAuthenticated())
        {
            throw new IllegalStateException("User is not authenticated");
        }

        String email = authentication.getName();

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Authenticated user is not found"));

        return new UserDetailsResponse
        (
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getIdNum(),
            user.getRole().name()
        );
    }

    public String getAuthenticationStatus()
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String response;

        if(authentication == null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken)
        {
            response = "Not authenticated";
        }
        else
        {
            response = "Authenticated";
        }

        return response;
    }
}
