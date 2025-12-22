package com.wildocsai.backend.repository;

import com.wildocsai.backend.entity.VerificationCodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCodeEntity, Long>
{
    Optional<VerificationCodeEntity> findByCode(String code);
}
