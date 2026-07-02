package com.tut.ai_tutormatch.repository;

import com.tut.ai_tutormatch.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository
        extends JpaRepository<Admin, Long> {
}