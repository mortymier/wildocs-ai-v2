package com.wildocsai.backend.repository;

import com.wildocsai.backend.entity.ClassEntity;
import com.wildocsai.backend.entity.EnrollmentEntity;
import com.wildocsai.backend.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<EnrollmentEntity, Long>
{
    List<EnrollmentEntity> findByClassEntity(ClassEntity classEntity);

    // Custom query for fetching all classes that a student has joined
    @Query("SELECT e.classEntity FROM EnrollmentEntity e WHERE e.student = :student")
    List<ClassEntity> findClassesByStudent(@Param("student") UserEntity student);
}
