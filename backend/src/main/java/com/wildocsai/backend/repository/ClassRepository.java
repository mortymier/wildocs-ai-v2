package com.wildocsai.backend.repository;

import com.wildocsai.backend.entity.ClassEntity;
import com.wildocsai.backend.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClassRepository extends JpaRepository<ClassEntity, Long>
{
    Optional<ClassEntity> findByJoinCode(String joinCode);
    List<ClassEntity> findByTeacher(UserEntity teacher);
}
