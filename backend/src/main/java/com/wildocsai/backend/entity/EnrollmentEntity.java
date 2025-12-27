package com.wildocsai.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_enrollments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "enrollment_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private ClassEntity classEntity;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity student;

    private LocalDateTime joinedAt;

    @PrePersist
    public void onJoin()
    {
        joinedAt = LocalDateTime.now();
    }
}
