package com.tut.ai_tutormatch.repository;

import com.tut.ai_tutormatch.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface StudentRepository
        extends JpaRepository<Student, Long> {

    Long countByRiskLevel(String riskLevel);

    @Query("SELECT AVG(s.academicAverage) FROM Student s")
    Double getAverageAcademicPerformance();
}