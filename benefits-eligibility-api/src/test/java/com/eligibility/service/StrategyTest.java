package com.eligibility.service;

import com.eligibility.model.Applicant;
import com.eligibility.model.enums.EmploymentStatus;
import com.eligibility.service.strategy.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class StrategyTest {

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Applicant baseApplicant() {
        return Applicant.builder()
                .id(1L)
                .firstName("Test")
                .lastName("User")
                .age(30)
                .annualIncome(new BigDecimal("12000"))
                .employmentStatus(EmploymentStatus.UNEMPLOYED)
                .householdSize(1)
                .dependentChildren(0)
                .hasDisability(false)
                .isVeteran(false)
                .isCaregiver(false)
                .build();
    }

    // ── Jobseeker Allowance ───────────────────────────────────────────────────

    @Test
    @DisplayName("Jobseeker: unemployed, low income, working age → eligible")
    void jobseeker_eligible() {
        EligibilityResult result = new JobseekerAllowanceStrategy().evaluate(baseApplicant());
        assertThat(result.isEligible()).isTrue();
        assertThat(result.getFailedRules()).isEmpty();
    }

    @Test
    @DisplayName("Jobseeker: employed full-time → not eligible")
    void jobseeker_employed_notEligible() {
        Applicant a = baseApplicant();
        a.setEmploymentStatus(EmploymentStatus.EMPLOYED_FULL_TIME);
        EligibilityResult result = new JobseekerAllowanceStrategy().evaluate(a);
        assertThat(result.isEligible()).isFalse();
        assertThat(result.getFailedRules()).hasSize(1);
    }

    @Test
    @DisplayName("Jobseeker: income above threshold → not eligible")
    void jobseeker_highIncome_notEligible() {
        Applicant a = baseApplicant();
        a.setAnnualIncome(new BigDecimal("20000"));
        EligibilityResult result = new JobseekerAllowanceStrategy().evaluate(a);
        assertThat(result.isEligible()).isFalse();
    }

    @Test
    @DisplayName("Jobseeker: retired applicant (age 70) → not eligible due to age rule")
    void jobseeker_retired_overAge() {
        Applicant a = baseApplicant();
        a.setAge(70);
        a.setEmploymentStatus(EmploymentStatus.RETIRED);
        EligibilityResult result = new JobseekerAllowanceStrategy().evaluate(a);
        assertThat(result.isEligible()).isFalse();
    }

    // ── Housing Assistance ────────────────────────────────────────────────────

    @Test
    @DisplayName("Housing: household size 3, low income → eligible")
    void housing_largeHousehold_eligible() {
        Applicant a = baseApplicant();
        a.setHouseholdSize(3);
        a.setDependentChildren(1);
        EligibilityResult result = new HousingAssistanceStrategy().evaluate(a);
        assertThat(result.isEligible()).isTrue();
    }

    @Test
    @DisplayName("Housing: single adult, no disability, high income → not eligible")
    void housing_singleHighIncome_notEligible() {
        Applicant a = baseApplicant();
        a.setAnnualIncome(new BigDecimal("50000"));
        EligibilityResult result = new HousingAssistanceStrategy().evaluate(a);
        assertThat(result.isEligible()).isFalse();
    }

    @Test
    @DisplayName("Housing: single with disability qualifies on household rule")
    void housing_singleWithDisability_eligible() {
        Applicant a = baseApplicant();
        a.setHasDisability(true);
        EligibilityResult result = new HousingAssistanceStrategy().evaluate(a);
        assertThat(result.isEligible()).isTrue();
    }

    // ── Disability Support ────────────────────────────────────────────────────

    @Test
    @DisplayName("Disability: has disability, unable to work, low income → eligible")
    void disability_eligible() {
        Applicant a = baseApplicant();
        a.setHasDisability(true);
        a.setEmploymentStatus(EmploymentStatus.UNABLE_TO_WORK_DISABILITY);
        EligibilityResult result = new DisabilitySupportStrategy().evaluate(a);
        assertThat(result.isEligible()).isTrue();
    }

    @Test
    @DisplayName("Disability: no disability flag → not eligible regardless of income")
    void disability_noFlag_notEligible() {
        EligibilityResult result = new DisabilitySupportStrategy().evaluate(baseApplicant());
        assertThat(result.isEligible()).isFalse();
        assertThat(result.getFailedRules()).contains("Applicant must have a documented disability");
    }

    // ── Family Tax Credit ─────────────────────────────────────────────────────

    @Test
    @DisplayName("FamilyTax: two children, income under threshold → eligible")
    void familyTax_eligible() {
        Applicant a = baseApplicant();
        a.setDependentChildren(2);
        a.setAnnualIncome(new BigDecimal("40000"));
        EligibilityResult result = new FamilyTaxCreditStrategy().evaluate(a);
        assertThat(result.isEligible()).isTrue();
    }

    @Test
    @DisplayName("FamilyTax: no children → not eligible")
    void familyTax_noChildren_notEligible() {
        EligibilityResult result = new FamilyTaxCreditStrategy().evaluate(baseApplicant());
        assertThat(result.isEligible()).isFalse();
    }

    // ── Emergency Relief ──────────────────────────────────────────────────────

    @Test
    @DisplayName("Emergency: unemployed, low income → eligible")
    void emergency_unemployed_eligible() {
        EligibilityResult result = new EmergencyReliefStrategy().evaluate(baseApplicant());
        assertThat(result.isEligible()).isTrue();
    }

    @Test
    @DisplayName("Emergency: veteran, low income → eligible via veteran status")
    void emergency_veteran_eligible() {
        Applicant a = baseApplicant();
        a.setEmploymentStatus(EmploymentStatus.EMPLOYED_FULL_TIME);
        a.setIsVeteran(true);
        EligibilityResult result = new EmergencyReliefStrategy().evaluate(a);
        assertThat(result.isEligible()).isTrue();
    }

    @Test
    @DisplayName("Emergency: employed full-time, high income, no vulnerability → not eligible")
    void emergency_noVulnerability_notEligible() {
        Applicant a = baseApplicant();
        a.setEmploymentStatus(EmploymentStatus.EMPLOYED_FULL_TIME);
        a.setAnnualIncome(new BigDecimal("60000"));
        EligibilityResult result = new EmergencyReliefStrategy().evaluate(a);
        assertThat(result.isEligible()).isFalse();
    }
}
