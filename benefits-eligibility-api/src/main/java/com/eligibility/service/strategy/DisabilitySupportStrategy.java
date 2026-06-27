package com.eligibility.service.strategy;

import com.eligibility.model.Applicant;
import com.eligibility.model.enums.BenefitType;
import com.eligibility.model.enums.EmploymentStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Disability Support Pension: requires documented disability flag, income test,
 * and inability or limited capacity to work.
 */
@Component
public class DisabilitySupportStrategy implements BenefitEligibilityStrategy {

    private static final BigDecimal INCOME_THRESHOLD = new BigDecimal("30000");

    @Override
    public BenefitType getBenefitType() {
        return BenefitType.DISABILITY_SUPPORT;
    }

    @Override
    public EligibilityResult evaluate(Applicant applicant) {
        List<String> passed = new ArrayList<>();
        List<String> failed = new ArrayList<>();

        // Rule 1: Must have disability flag
        EligibilityRule disabilityRule = new EligibilityRule() {
            @Override
            public boolean isSatisfied(Applicant a) {
                return Boolean.TRUE.equals(a.getHasDisability());
            }
            @Override
            public String describe() {
                return "Applicant must have a documented disability";
            }
        };

        // Rule 2: Employment status must indicate inability or limited capacity to work
        EligibilityRule employmentRule = new EligibilityRule() {
            @Override
            public boolean isSatisfied(Applicant a) {
                return a.getEmploymentStatus() == EmploymentStatus.UNABLE_TO_WORK_DISABILITY
                        || a.getEmploymentStatus() == EmploymentStatus.EMPLOYED_PART_TIME
                        || a.getEmploymentStatus() == EmploymentStatus.UNEMPLOYED;
            }
            @Override
            public String describe() {
                return "Employment status must reflect limited or no work capacity";
            }
        };

        // Rule 3: Income below threshold
        EligibilityRule incomeRule = new EligibilityRule() {
            @Override
            public boolean isSatisfied(Applicant a) {
                return a.getAnnualIncome().compareTo(INCOME_THRESHOLD) < 0;
            }
            @Override
            public String describe() {
                return "Annual income must be below $" + INCOME_THRESHOLD;
            }
        };

        List<EligibilityRule> rules = List.of(disabilityRule, employmentRule, incomeRule);

        boolean allPassed = true;
        for (EligibilityRule rule : rules) {
            if (rule.isSatisfied(applicant)) {
                passed.add(rule.describe());
            } else {
                failed.add(rule.describe());
                allPassed = false;
            }
        }

        return EligibilityResult.builder()
                .eligible(allPassed)
                .passedRules(passed)
                .failedRules(failed)
                .build();
    }
}
