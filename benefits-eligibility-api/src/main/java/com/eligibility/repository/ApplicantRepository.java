package com.eligibility.repository;

import com.eligibility.model.Applicant;
import com.eligibility.model.enums.EmploymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ApplicantRepository extends JpaRepository<Applicant, Long> {

    List<Applicant> findByEmploymentStatus(EmploymentStatus status);

    @Query("SELECT a FROM Applicant a WHERE a.annualIncome <= :threshold")
    List<Applicant> findByIncomeAtOrBelow(@Param("threshold") BigDecimal threshold);

    @Query("SELECT a FROM Applicant a WHERE a.dependentChildren > 0")
    List<Applicant> findApplicantsWithDependents();

    @Query("SELECT a FROM Applicant a WHERE a.hasDisability = true")
    List<Applicant> findApplicantsWithDisability();

    @Query("SELECT a FROM Applicant a WHERE a.user.id = :userId")
    java.util.Optional<Applicant> findByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);
}
