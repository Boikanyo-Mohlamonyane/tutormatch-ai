package com.tut.ai_tutormatch.repository;

import com.tut.ai_tutormatch.model.Tutor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TutorRepository extends JpaRepository<Tutor, Long> {

    Optional<Tutor> findByUserUserId(Long userId);

}