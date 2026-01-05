package com.wildocsai.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "submission_id")
    private Long id;

    // The sequence number of a submission in a class (starts with 1)
    private Integer submissionNumber;

    private String fileName;
    private String fileExtension;

    private LocalDateTime submittedAt;

    // Contains SDD content converted to JSON
    @Lob
    @Column(columnDefinition = "MEDIUMTEXT")
    private String content;

    // Contains AI evaluation result JSON
    @Lob
    @Column(columnDefinition = "MEDIUMTEXT")
    private String aiEvaluation;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private ClassEntity classEntity;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private UserEntity student;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String teacherFeedback;

    // Indicates if the teacher likes or dislikes the submission
    private Boolean thumbsUp;

    // Indicates if the submission has been evaluated by AI
    private Boolean isEvaluated;

    @PrePersist
    protected void onSubmit()
    {
        submittedAt = LocalDateTime.now();
        aiEvaluation = null;
        teacherFeedback = null;
        thumbsUp = null;
        isEvaluated = false;
    }
}
