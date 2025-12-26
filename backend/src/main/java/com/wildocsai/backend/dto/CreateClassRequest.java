package com.wildocsai.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateClassRequest
{
    @NotBlank(message = "Class name cannot be blank")
    private String className;

    @NotBlank(message = "School year cannot be blank")
    private String schoolYear;

    @NotBlank(message = "Semester cannot be blank")
    private String semester;

    @NotBlank(message = "Section cannot be blank")
    private String section;
}
