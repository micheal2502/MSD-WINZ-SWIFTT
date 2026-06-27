package com.eligibility.controller;

import com.eligibility.dto.EligibilityAssessmentResponse;
import com.eligibility.dto.EligibilityReportResponse;
import com.eligibility.model.enums.BenefitType;
import com.eligibility.service.EligibilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/eligibility")
@RequiredArgsConstructor
public class EligibilityController {

    private final EligibilityService eligibilityService;

    /**
     * POST /api/v1/eligibility/applicants/{id}/assess
     * Runs a full assessment across all 5+ benefit types.
     */
    @PostMapping("/applicants/{id}/assess")
    public ResponseEntity<EligibilityReportResponse> assessAll(@PathVariable Long id) {
        return ResponseEntity.ok(eligibilityService.assessAll(id));
    }

    /**
     * POST /api/v1/eligibility/applicants/{id}/assess/{benefitType}
     * Assess eligibility for a single benefit type.
     */
    @PostMapping("/applicants/{id}/assess/{benefitType}")
    public ResponseEntity<EligibilityAssessmentResponse> assessSingle(
            @PathVariable Long id,
            @PathVariable BenefitType benefitType) {
        return ResponseEntity.ok(eligibilityService.assessSingle(id, benefitType));
    }

    /**
     * GET /api/v1/eligibility/applicants/{id}/assessments
     * Retrieve all stored assessments for an applicant.
     */
    @GetMapping("/applicants/{id}/assessments")
    public ResponseEntity<List<EligibilityAssessmentResponse>> getAssessments(@PathVariable Long id) {
        return ResponseEntity.ok(eligibilityService.getAssessmentsForApplicant(id));
    }

    /**
     * GET /api/v1/eligibility/applicants/{id}/eligible
     * Retrieve only the benefits the applicant qualifies for.
     */
    @GetMapping("/applicants/{id}/eligible")
    public ResponseEntity<List<EligibilityAssessmentResponse>> getEligible(@PathVariable Long id) {
        return ResponseEntity.ok(eligibilityService.getEligibleBenefitsForApplicant(id));
    }
}
