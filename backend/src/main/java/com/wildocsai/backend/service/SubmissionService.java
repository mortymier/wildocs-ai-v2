package com.wildocsai.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.wildocsai.backend.dto.SubmissionDetailsResponse;
import com.wildocsai.backend.entity.ClassEntity;
import com.wildocsai.backend.entity.SubmissionEntity;
import com.wildocsai.backend.entity.UserEntity;
import com.wildocsai.backend.repository.ClassRepository;
import com.wildocsai.backend.repository.EnrollmentRepository;
import com.wildocsai.backend.repository.SubmissionRepository;
import com.wildocsai.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubmissionService
{
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final ClassRepository classRepository;
    private final EnrollmentRepository enrollmentRepository;

    public SubmissionDetailsResponse createSubmissionFromUpload(MultipartFile file, String email, String joinCode)
    {
        // 1. Validate file format
        SubmissionUtility.validateFileFormat(file);

        // 2. Find student
        UserEntity student = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Student with email " + email + " not found."));

        // 3. Find class
        ClassEntity classEntity = classRepository.findByJoinCode(joinCode)
                .orElseThrow(() -> new IllegalArgumentException("Class with join code " + joinCode + " not found."));

        // 4. Check if student is enrolled in the class
        if (!enrollmentRepository.existsByStudentAndClass(student, classEntity))
        {
            throw new IllegalArgumentException("The student is not enrolled in the specified class.");
        }

        try
        {
            // 5. Extract content and images from PDF
            SubmissionUtility.PDFData pdfData = SubmissionUtility.extractPDFData(file);
            log.info("Extracted content: {}", pdfData.getContent());

            // 6. Clean content
            String cleaned = SubmissionUtility.cleanContent(pdfData.getContent());
            log.info("Cleaned content: {}", cleaned);

            // 7. Validate SDD structure
            if(!SubmissionUtility.isLikelySDD(cleaned))
            {
                throw new IllegalArgumentException("The uploaded file is not a valid SDD.");
            }

            // 8. Convert to JSON with image data
            String contentJSON = SubmissionUtility.toStructuredJSON(cleaned, pdfData.getImagesPerPage(), pdfData.getSectionPages());

            // 9. Generate submission number
            Integer maxSubmissionNumber = submissionRepository.findMaxSubmissionNumberInClass(classEntity);
            int newSubmissionNumber = (maxSubmissionNumber == null) ? 1 : maxSubmissionNumber + 1;

            // 10. Create submission entity
            SubmissionEntity submission = new SubmissionEntity();
            submission.setSubmissionNumber(newSubmissionNumber);
            submission.setFileName(file.getOriginalFilename());
            submission.setFileExtension(SubmissionUtility.getFileExtension(file.getOriginalFilename()));
            submission.setContent(contentJSON);
            submission.setClassEntity(classEntity);
            submission.setStudent(student);

            // 10. Save submission
            submissionRepository.save(submission);

            // 11. Create submission details response and return
            return new SubmissionDetailsResponse
            (
                submission.getSubmissionNumber(),
                submission.getFileName(),
                submission.getFileExtension(),
                submission.getContent(),
                submission.getTeacherFeedback(),
                submission.getThumbsUp(),
                submission.getIsEvaluated(),
                submission.getSubmittedAt(),
                submission.getStudent().getEmail(),
                submission.getClassEntity().getJoinCode()
            );
        }
        catch(Exception e)
        {
            throw new IllegalArgumentException("Failed to process submission: " + e.getMessage(), e);
        }
    }
}