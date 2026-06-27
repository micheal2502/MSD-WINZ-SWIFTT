package com.eligibility.repository;

import com.eligibility.model.EligibilityAssessment;
import com.eligibility.model.enums.BenefitType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EligibilityAssessmentRepository extends JpaRepository<EligibilityAssessment, Long> {

    List<EligibilityAssessment> findByApplicantId(Long applicantId);

    List<EligibilityAssessment> findByApplicantIdAndEligibleTrue(Long applicantId);

    @Query("SELECT e FROM EligibilityAssessment e WHERE e.benefitType = :type AND e.eligible = true")
    List<EligibilityAssessment> findEligibleByBenefitType(@Param("type") BenefitType type);

    @Query("SELECT COUNT(e) FROM EligibilityAssessment e WHERE e.benefitType = :type AND e.eligible = true")
    long countEligibleByBenefitType(@Param("type") BenefitType type);
}
