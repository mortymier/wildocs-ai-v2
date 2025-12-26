package com.wildocsai.backend.service;

import com.wildocsai.backend.dto.ClassDetailsResponse;
import com.wildocsai.backend.dto.CreateClassRequest;
import com.wildocsai.backend.entity.ClassEntity;
import com.wildocsai.backend.entity.UserEntity;
import com.wildocsai.backend.repository.ClassRepository;
import com.wildocsai.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClassService
{
    private final ClassRepository classRepository;
    private final UserRepository userRepository;

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

    public List<ClassEntity> getClassesByTeacher2(String email)
    {
        UserEntity teacher = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Teacher not found with email: " + email));

        return classRepository.findByTeacher(teacher);
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
}
