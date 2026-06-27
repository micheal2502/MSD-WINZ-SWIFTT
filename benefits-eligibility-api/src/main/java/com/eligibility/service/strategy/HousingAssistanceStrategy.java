package com.eligibility.service.strategy;

import com.eligibility.model.Applicant;
import com.eligibility.model.enums.BenefitType;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Housing Assistance: income-tested, with extra weight for large households and dependents.
 */
@Component
public class HousingAssistanceStrategy implements BenefitEligibilityStrategy {

    // Base threshold scales with household size
    private static final BigDecimal BASE_THRESHOLD = new BigDecimal("20000");
    private static final BigDecimal PER_DEPENDENT_ALLOWANCE = new BigDecimal("3000");

    @Override
    public BenefitType getBenefitType() {
        return BenefitType.HOUSING_ASSISTANCE;
    }

    @Override
    public EligibilityResult evaluate(Applicant applicant) {
        List<String> passed = new ArrayList<>();
        List<String> failed = new ArrayList<>();

        BigDecimal adjustedThreshold = BASE_THRESHOLD.add(
                PER_DEPENDENT_ALLOWANCE.multiply(BigDecimal.valueOf(applicant.getDependentChildren()))
        );

        // Rule 1: Income below household-adjusted threshold
        EligibilityRule incomeRule = new EligibilityRule() {
            @Override
            public boolean isSatisfied(Applicant a) {
                return a.getAnnualIncome().compareTo(adjustedThreshold) < 0;
            }
            @Override
            public String describe() {
                return "Income must be below household-adjusted threshold of $" + adjustedThreshold;
            }
        };

        // Rule 2: Household size >= 2 OR has disability
        EligibilityRule householdRule = new EligibilityRule() {
            @Override
            public boolean isSatisfied(Applicant a) {
                return a.getHouseholdSize() >= 2 || Boolean.TRUE.equals(a.getHasDisability());
            }
            @Override
            public String describe() {
                return "Household size must be ≥2 or applicant must have a disability";
            }
        };

        List<EligibilityRule> rules = List.of(incomeRule, householdRule);

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
