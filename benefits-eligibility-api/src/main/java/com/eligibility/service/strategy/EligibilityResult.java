package com.eligibility.service.strategy;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class EligibilityResult {

    private final boolean eligible;
    private final List<String> passedRules;
    private final List<String> failedRules;

    public String buildReasoning() {
        StringBuilder sb = new StringBuilder();
        if (eligible) {
            sb.append("ELIGIBLE. ");
        } else {
            sb.append("NOT ELIGIBLE. ");
        }
        if (!passedRules.isEmpty()) {
            sb.append("Passed: ").append(String.join("; ", passedRules)).append(". ");
        }
        if (!failedRules.isEmpty()) {
            sb.append("Failed: ").append(String.join("; ", failedRules)).append(".");
        }
        return sb.toString().trim();
    }
}
