package com.eligibility.service.strategy;

import com.eligibility.model.Applicant;
import com.eligibility.model.enums.BenefitType;

/**
 * Top-level strategy for a specific benefit type.
 * Composes one or more EligibilityRules via chain-of-responsibility.
 */
public interface BenefitEligibilityStrategy {

    BenefitType getBenefitType();

    EligibilityResult evaluate(Applicant applicant);
}
