package com.eligibility.service.strategy;

import com.eligibility.model.Applicant;
import com.eligibility.model.enums.BenefitType;
import com.eligibility.model.enums.EmploymentStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Jobseeker's Allowance: for unemployed applicants actively seeking work,
 * with income below threshold.
 */
@Component
public class JobseekerAllowanceStrategy implements BenefitEligibilityStrategy {

    private static final BigDecimal INCOME_THRESHOLD = new BigDecimal("15000");

    @Override
    public BenefitType getBenefitType() {
        return BenefitType.JOBSEEKER_ALLOWANCE;
    }

    @Override
    public EligibilityResult evaluate(Applicant applicant) {
        List<String> passed = new ArrayList<>();
        List<String> failed = new ArrayList<>();

        // Rule 1: Must be unemployed
        EligibilityRule unemployedRule = new EligibilityRule() {
            @Override
            public boolean isSatisfied(Applicant a) {
                return a.getEmploymentStatus() == EmploymentStatus.UNEMPLOYED;
            }
            @Override
            public String describe() {
                return "Employment status must be UNEMPLOYED";
            }
        };

        // Rule 2: Income below threshold
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

        // Rule 3: Must be of working age (18-65)
        EligibilityRule ageRule = new EligibilityRule() {
            @Override
            public boolean isSatisfied(Applicant a) {
                return a.getAge() >= 18 && a.getAge() <= 65;
            }
            @Override
            public String describe() {
                return "Applicant must be between 18 and 65 years old";
            }
        };

        List<EligibilityRule> rules = List.of(unemployedRule, incomeRule, ageRule);

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
