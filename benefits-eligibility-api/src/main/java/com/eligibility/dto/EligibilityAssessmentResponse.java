package com.eligibility.dto;

import com.eligibility.model.enums.BenefitType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class EligibilityAssessmentResponse {
    private Long id;
    private Long applicantId;
    private BenefitType benefitType;
    private Boolean eligible;
    private String reasoning;
    private LocalDateTime assessedAt;
}
