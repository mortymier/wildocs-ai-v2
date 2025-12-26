package com.wildocsai.backend.controller;

import com.wildocsai.backend.dto.ClassDetailsResponse;
import com.wildocsai.backend.dto.CreateClassRequest;
import com.wildocsai.backend.entity.ClassEntity;
import com.wildocsai.backend.service.ClassService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/class")
@RequiredArgsConstructor
public class ClassController
{
    private final ClassService classService;

    @PostMapping("/create")
    public ResponseEntity<?> createClass(@Valid @RequestBody CreateClassRequest request, @RequestParam String email)
    {
        try
        {
            ClassEntity newClass = classService.createClass(request, email);
            return ResponseEntity.status(HttpStatus.CREATED).body(newClass);
        }
        catch(RuntimeException e)
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/all/teacher")
    public ResponseEntity<?> getClassesByTeacher(@RequestParam String email)
    {
        try
        {
            List<ClassDetailsResponse> classes = classService.getClassesByTeacher(email);
            return ResponseEntity.ok(classes);
        }
        catch(RuntimeException e)
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
