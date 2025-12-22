package com.wildocsai.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_vcodes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerificationCodeEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "verification_id")
    private Long id;

    @Column(unique = true)
    private String code;

    @OneToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Enumerated(EnumType.STRING)
    private VerificationType type;

    private LocalDateTime verifiedAt = null;
}
