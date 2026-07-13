package com.tut.ai_tutormatch.service;

import com.tut.ai_tutormatch.enums.Specialization;
import com.tut.ai_tutormatch.model.Student;
import com.tut.ai_tutormatch.model.Tutor;
import com.tut.ai_tutormatch.repository.TutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MatchingService {

    @Autowired
    private TutorRepository tutorRepo;

    public Tutor findBestTutor(Student student) {

        List<Tutor> tutors = tutorRepo.findAll();

        Tutor bestTutor = null;
        double highestScore = 0;

        for (Tutor tutor : tutors) {

            double score = 0;

            // EXPERIENCE SCORE
            if (tutor.getYearsExperience() >= 5) {
                score += 20;
            }

            // SPECIALIZATION SCORE
            if (tutor.getSpecialization() == Specialization.SOFTWARE_ENGINEERING
                    || tutor.getSpecialization() == Specialization.COMPUTER_SCIENCE
                    || tutor.getSpecialization() == Specialization.WEB_DEVELOPMENT
                    || tutor.getSpecialization() == Specialization.MOBILE_DEVELOPMENT) {

                score += 50;
            }

            // HIGH-RISK BONUS
            if ("HIGH".equalsIgnoreCase(student.getRiskLevel())) {
                score += 15;
            }

            if (score > highestScore) {
                highestScore = score;
                bestTutor = tutor;
            }
        }

        return bestTutor;
    }
}