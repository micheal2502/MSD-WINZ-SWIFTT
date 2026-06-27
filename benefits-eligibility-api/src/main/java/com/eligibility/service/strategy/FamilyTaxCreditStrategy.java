package com.eligibility.service.strategy;

import com.eligibility.model.Applicant;
import com.eligibility.model.enums.BenefitType;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Family Tax Credit: for families with dependent children and income below a higher threshold.
 * Recognises caregivers with additional allowances.
 */
@Component
public class FamilyTaxCreditStrategy implements BenefitEligibilityStrategy {

    private static final BigDecimal BASE_THRESHOLD = new BigDecimal("55000");
    private static final BigDecimal PER_CHILD_ALLOWANCE = new BigDecimal("5000");

    @Override
    public BenefitType getBenefitType() {
        return BenefitType.FAMILY_TAX_CREDIT;
    }

    @Override
    public EligibilityResult evaluate(Applicant applicant) {
        List<String> passed = new ArrayList<>();
        List<String> failed = new ArrayList<>();

        // Rule 1: Must have at least one dependent child
        EligibilityRule dependentRule = new EligibilityRule() {
            @Override
            public boolean isSatisfied(Applicant a) {
                return a.getDependentChildren() > 0;
            }
            @Override
            public String describe() {
                return "Must have at least one dependent child";
            }
        };

        // Rule 2: Income below threshold adjusted for number of children
        BigDecimal adjustedThreshold = BASE_THRESHOLD.add(
                PER_CHILD_ALLOWANCE.multiply(BigDecimal.valueOf(applicant.getDependentChildren()))
        );
        EligibilityRule incomeRule = new EligibilityRule() {
            @Override
            public boolean isSatisfied(Applicant a) {
                return a.getAnnualIncome().compareTo(adjustedThreshold) < 0;
            }
            @Override
            public String describe() {
                return "Annual income must be below child-adjusted threshold of $" + adjustedThreshold;
            }
        };

        List<EligibilityRule> rules = List.of(dependentRule, incomeRule);

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
