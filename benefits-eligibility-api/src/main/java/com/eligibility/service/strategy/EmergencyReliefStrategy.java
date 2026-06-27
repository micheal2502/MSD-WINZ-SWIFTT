package com.eligibility.service.strategy;

import com.eligibility.model.Applicant;
import com.eligibility.model.enums.BenefitType;
import com.eligibility.model.enums.EmploymentStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Emergency Relief: broad safety-net with the lowest income bar;
 * any critical vulnerability (unemployment, disability, veteran, caregiver) qualifies.
 */
@Component
public class EmergencyReliefStrategy implements BenefitEligibilityStrategy {

    private static final BigDecimal INCOME_THRESHOLD = new BigDecimal("25000");

    @Override
    public BenefitType getBenefitType() {
        return BenefitType.EMERGENCY_RELIEF;
    }

    @Override
    public EligibilityResult evaluate(Applicant applicant) {
        List<String> passed = new ArrayList<>();
        List<String> failed = new ArrayList<>();

        // Rule 1: Income below emergency threshold
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

        // Rule 2 (OR): Must have at least one vulnerability marker
        EligibilityRule vulnerabilityRule = new EligibilityRule() {
            @Override
            public boolean isSatisfied(Applicant a) {
                return Boolean.TRUE.equals(a.getHasDisability())
                        || Boolean.TRUE.equals(a.getIsVeteran())
                        || Boolean.TRUE.equals(a.getIsCaregiver())
                        || a.getEmploymentStatus() == EmploymentStatus.UNEMPLOYED
                        || a.getDependentChildren() > 0;
            }
            @Override
            public String describe() {
                return "Must have at least one vulnerability indicator (disability, veteran status, caregiver, unemployment, or dependent children)";
            }
        };

        List<EligibilityRule> rules = List.of(incomeRule, vulnerabilityRule);

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
