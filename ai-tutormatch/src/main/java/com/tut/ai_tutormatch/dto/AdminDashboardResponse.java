package com.tut.ai_tutormatch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardResponse {

    private Long totalStudents;

    private Long totalTutors;

    private Long totalSubjects;

    private Long totalBookings;

    private Long totalAdmins;

    private Double averageAcademicPerformance;

    private Long highRiskStudents;
}