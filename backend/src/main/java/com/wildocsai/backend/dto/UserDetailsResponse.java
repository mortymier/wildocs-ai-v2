package com.wildocsai.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDetailsResponse
{
    private String firstName;
    private String lastName;
    private String email;
    private String idNum;
    private String role;
}
