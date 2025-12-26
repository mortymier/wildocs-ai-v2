package com.wildocsai.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ClassDetailsResponse
{
    private String className;
    private String schoolYear;
    private String semester;
    private String section;
    private String joinCode;
}
