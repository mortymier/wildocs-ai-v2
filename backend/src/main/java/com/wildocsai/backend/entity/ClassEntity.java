package com.wildocsai.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_classes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "class_id")
    private Long id;

    private String className;
    private String schoolYear;
    private String semester;
    private String section;

    @Column(unique = true)
    private String joinCode;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private UserEntity teacher;

    @PrePersist
    protected void onCreate()
    {
        createdAt = LocalDateTime.now();
    }
}
