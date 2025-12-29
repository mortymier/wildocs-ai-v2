package com.wildocsai.backend.controller;

import com.wildocsai.backend.dto.ClassDetailsResponse;
import com.wildocsai.backend.dto.CreateClassRequest;
import com.wildocsai.backend.dto.UserDetailsResponse;
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

    @PostMapping("/join")
    public ResponseEntity<?> joinClass(@RequestParam String email, @RequestParam String joinCode)
    {
        try
        {
            String response = classService.joinClass(email, joinCode);
            return ResponseEntity.ok(response);
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

    @GetMapping("/all/student")
    public ResponseEntity<?> getClassesByStudent(@RequestParam String email)
    {
        try
        {
            List<ClassDetailsResponse> classes = classService.getClassesByStudent(email);
            return ResponseEntity.ok(classes);
        }
        catch(RuntimeException e)
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/details")
    public ResponseEntity<?> getClassDetails(@RequestParam String joinCode)
    {
        try
        {
            ClassDetailsResponse classDetails = classService.getClassDetails(joinCode);
            return ResponseEntity.ok(classDetails);
        }
        catch(RuntimeException e)
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/student-list")
    public ResponseEntity<?> getStudentsInClass(@RequestParam String joinCode)
    {
        try
        {
            List<UserDetailsResponse> students =  classService.getStudentsInClass(joinCode);
            return ResponseEntity.ok(students);
        }
        catch(RuntimeException e)
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
