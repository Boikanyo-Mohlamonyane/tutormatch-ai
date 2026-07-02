package com.tut.ai_tutormatch.repository;

import com.tut.ai_tutormatch.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentPerformanceRepository extends JpaRepository<StudentPerformance, Long> {

    List<StudentPerformance> findByStudent(Student student);
}