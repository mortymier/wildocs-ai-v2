package com.wildocsai.backend.service;

import com.wildocsai.backend.dto.ClassDetailsResponse;
import com.wildocsai.backend.dto.CreateClassRequest;
import com.wildocsai.backend.dto.UserDetailsResponse;
import com.wildocsai.backend.entity.ClassEntity;
import com.wildocsai.backend.entity.EnrollmentEntity;
import com.wildocsai.backend.entity.UserEntity;
import com.wildocsai.backend.repository.ClassRepository;
import com.wildocsai.backend.repository.EnrollmentRepository;
import com.wildocsai.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClassService
{
    private final ClassRepository classRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    // For generating unique class join codes
    private static final String CODE_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 6;

    private String generateUniqueJoinCode()
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
        while(classRepository.findByJoinCode(code).isPresent()); // Ensure the code is unique

        return code;
    }

    public ClassEntity createClass(CreateClassRequest request, String email)
    {
        String joinCode = generateUniqueJoinCode();

        UserEntity teacher = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Teacher not found with email: " + email));

        ClassEntity newClass = new ClassEntity();
        newClass.setClassName(request.getClassName());
        newClass.setSchoolYear(request.getSchoolYear());
        newClass.setSemester(request.getSemester());
        newClass.setSection(request.getSection());
        newClass.setJoinCode(joinCode);
        newClass.setTeacher(teacher);

        return classRepository.save(newClass);
    }

    public List<ClassDetailsResponse> getClassesByTeacher(String email)
    {
        UserEntity teacher = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Teacher not found with email: " + email));

        List<ClassEntity> classes = classRepository.findByTeacher(teacher);

        return classes.stream()
                .map(classEntity -> new ClassDetailsResponse
                    (
                        classEntity.getClassName(),
                        classEntity.getSchoolYear(),
                        classEntity.getSemester(),
                        classEntity.getSection(),
                        classEntity.getJoinCode()
                    ))
                    .collect(Collectors.toList());
    }

    public String joinClass(String email, String joinCode)
    {
        UserEntity student = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with email: " + email));

        if (!student.getRole().name().equals("STUDENT")) 
        {
            throw new IllegalArgumentException("Only students can join classes.");
        }   

        ClassEntity classEntity = classRepository.findByJoinCode(joinCode)
                .orElseThrow(() -> new IllegalArgumentException("Class not found with join code: " + joinCode));

        boolean alreadyEnrolled = enrollmentRepository.findByClassEntity(classEntity).stream()
            .anyMatch(enrollment -> enrollment.getStudent().getId().equals(student.getId()));

        if (alreadyEnrolled) 
        {
            throw new IllegalArgumentException("You are already enrolled in this class.");
        }

        EnrollmentEntity enrollment =  new EnrollmentEntity();
        enrollment.setClassEntity(classEntity);
        enrollment.setStudent(student);

        try 
        {
            enrollmentRepository.save(enrollment);
        } 
        catch (DataIntegrityViolationException e) 
        {
            throw new IllegalArgumentException("You are already enrolled in this class.");
        }

        return "You have successfully joined the class: " + classEntity.getClassName() + "!";
    }

    public List<UserDetailsResponse> getStudentsInClass(String joinCode)
    {
        ClassEntity classEntity = classRepository.findByJoinCode(joinCode)
                .orElseThrow(() -> new IllegalArgumentException("Class not found with join code: " + joinCode));

        List<EnrollmentEntity> enrollments = enrollmentRepository.findByClassEntity(classEntity);

        return enrollments.stream()
                .map(enrollment ->
                {
                    UserEntity student = enrollment.getStudent();
                    return new UserDetailsResponse
                    (
                        student.getFirstName(),
                        student.getLastName(),
                        student.getEmail(),
                        student.getIdNum(),
                        student.getRole().name()
                    );
                })
                .collect(Collectors.toList());
    }

    public List<ClassDetailsResponse> getClassesByStudent(String email)
    {
        UserEntity student = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with email: " + email));

        List<ClassEntity> classes = enrollmentRepository.findClassesByStudent(student);

        return classes.stream()
                .map(classEntity -> new ClassDetailsResponse
                    (
                        classEntity.getClassName(),
                        classEntity.getSchoolYear(),
                        classEntity.getSemester(),
                        classEntity.getSection(),
                        classEntity.getJoinCode()
                    ))
                    .collect(Collectors.toList());
    }
}
