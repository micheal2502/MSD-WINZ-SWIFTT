package com.eligibility.service;

import com.eligibility.dto.EligibilityAssessmentResponse;
import com.eligibility.dto.EligibilityReportResponse;
import com.eligibility.model.Applicant;
import com.eligibility.model.EligibilityAssessment;
import com.eligibility.model.enums.BenefitType;
import com.eligibility.repository.EligibilityAssessmentRepository;
import com.eligibility.service.strategy.BenefitEligibilityStrategy;
import com.eligibility.service.strategy.EligibilityResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EligibilityService {

    private final ApplicantService applicantService;
    private final EligibilityAssessmentRepository assessmentRepository;

    // Spring injects ALL BenefitEligibilityStrategy beans — one per benefit type
    private final List<BenefitEligibilityStrategy> strategies;

    /**
     * Runs the full eligibility assessment for all benefit types for a given applicant.
     */
    public EligibilityReportResponse assessAll(Long applicantId) {
        Applicant applicant = applicantService.findById(applicantId);

        List<EligibilityAssessmentResponse> results = strategies.stream()
                .map(strategy -> runAndPersist(applicant, strategy))
                .collect(Collectors.toList());

        long eligible = results.stream().filter(EligibilityAssessmentResponse::getEligible).count();

        return EligibilityReportResponse.builder()
                .applicantId(applicantId)
                .applicantName(applicant.getFirstName() + " " + applicant.getLastName())
                .assessments(results)
                .eligibleCount(eligible)
                .totalBenefitsAssessed(results.size())
                .build();
    }

    /**
     * Assesses eligibility for a single specified benefit type.
     */
    public EligibilityAssessmentResponse assessSingle(Long applicantId, BenefitType benefitType) {
        Applicant applicant = applicantService.findById(applicantId);

        Map<BenefitType, BenefitEligibilityStrategy> strategyMap = strategies.stream()
                .collect(Collectors.toMap(BenefitEligibilityStrategy::getBenefitType, Function.identity()));

        BenefitEligibilityStrategy strategy = strategyMap.get(benefitType);
        if (strategy == null) {
            throw new IllegalArgumentException("No strategy registered for benefit type: " + benefitType);
        }

        return runAndPersist(applicant, strategy);
    }

    /**
     * Retrieves all stored assessments for an applicant.
     */
    @Transactional(readOnly = true)
    public List<EligibilityAssessmentResponse> getAssessmentsForApplicant(Long applicantId) {
        applicantService.findById(applicantId); // validate existence
        return assessmentRepository.findByApplicantId(applicantId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves only the eligible assessments for an applicant.
     */
    @Transactional(readOnly = true)
    public List<EligibilityAssessmentResponse> getEligibleBenefitsForApplicant(Long applicantId) {
        applicantService.findById(applicantId);
        return assessmentRepository.findByApplicantIdAndEligibleTrue(applicantId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ── private helpers ───────────────────────────────────────────────────────

    private EligibilityAssessmentResponse runAndPersist(Applicant applicant,
                                                         BenefitEligibilityStrategy strategy) {
        EligibilityResult result = strategy.evaluate(applicant);

        EligibilityAssessment assessment = EligibilityAssessment.builder()
                .applicant(applicant)
                .benefitType(strategy.getBenefitType())
                .eligible(result.isEligible())
                .reasoning(result.buildReasoning())
                .build();

        EligibilityAssessment saved = assessmentRepository.save(assessment);
        return toResponse(saved);
    }

    private EligibilityAssessmentResponse toResponse(EligibilityAssessment a) {
        return EligibilityAssessmentResponse.builder()
                .id(a.getId())
                .applicantId(a.getApplicant().getId())
                .benefitType(a.getBenefitType())
                .eligible(a.getEligible())
                .reasoning(a.getReasoning())
                .assessedAt(a.getAssessedAt())
                .build();
    }
}
