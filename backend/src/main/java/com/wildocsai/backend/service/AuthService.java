package com.wildocsai.backend.service;

import com.wildocsai.backend.dto.RegisterRequest;
import com.wildocsai.backend.entity.UserEntity;
import com.wildocsai.backend.entity.UserRole;
import com.wildocsai.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService
{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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

        return "Registration successful for " + user.getFirstName() + " " + user.getLastName() + "!"
                + " Please check your email for verification.";
    }
}
