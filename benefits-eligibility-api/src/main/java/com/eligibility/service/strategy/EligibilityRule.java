package com.eligibility.service.strategy;

import com.eligibility.model.Applicant;

/**
 * Strategy interface for individual eligibility rules.
 * Each implementation encapsulates one composable, independently testable rule.
 */
public interface EligibilityRule {

    /**
     * Evaluates whether this rule is satisfied for the given applicant.
     */
    boolean isSatisfied(Applicant applicant);

    /**
     * Returns a human-readable description of what this rule checks.
     */
    String describe();
}
