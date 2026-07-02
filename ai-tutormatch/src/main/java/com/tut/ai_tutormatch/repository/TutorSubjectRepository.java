package com.tut.ai_tutormatch.repository;

import com.tut.ai_tutormatch.model.Subject;
import com.tut.ai_tutormatch.model.Tutor;
import com.tut.ai_tutormatch.model.TutorSubject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TutorSubjectRepository
        extends JpaRepository<TutorSubject, Long> {

    List<TutorSubject> findByTutor(Tutor tutor);
    List<TutorSubject> findBySubject(Subject subject);
}