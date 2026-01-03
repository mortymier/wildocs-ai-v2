package com.wildocsai.backend.repository;

import com.wildocsai.backend.entity.ClassEntity;
import com.wildocsai.backend.entity.SubmissionEntity;
import com.wildocsai.backend.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<SubmissionEntity, Long>
{
    List<SubmissionEntity> findByClassEntity(ClassEntity classEntity);
    List<SubmissionEntity> findByStudent(UserEntity student);
    List<SubmissionEntity> findByClassEntityAndStudent(ClassEntity classEntity, UserEntity student);
    Optional<SubmissionEntity> findByClassEntityAndSubmissionNumber(ClassEntity classEntity, Integer submissionNumber);

    @Query("SELECT COALESCE(MAX(s.submissionNumber), 0) FROM SubmissionEntity s WHERE s.classEntity = :classEntity")
    Integer findMaxSubmissionNumberInClass(@Param("classEntity") ClassEntity classEntity);
}
