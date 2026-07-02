package com.tut.ai_tutormatch.repository;

import com.tut.ai_tutormatch.model.SessionBooking;
import com.tut.ai_tutormatch.model.Student;
import com.tut.ai_tutormatch.model.Tutor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface SessionBookingRepository extends JpaRepository<SessionBooking, Long> {


    List<SessionBooking> findByStudent(Student student);
    List<SessionBooking> findByTutor(Tutor tutor);
    boolean existsByTutorAndSessionDate(
            Tutor tutor,
            LocalDateTime sessionDate
    );

}