package com.eligibility.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class EligibilityReportResponse {
    private Long applicantId;
    private String applicantName;
    private List<EligibilityAssessmentResponse> assessments;
    private long eligibleCount;
    private long totalBenefitsAssessed;
}
