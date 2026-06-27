package com.eligibility.service;

import com.eligibility.dto.EligibilityReportResponse;
import com.eligibility.model.Applicant;
import com.eligibility.model.EligibilityAssessment;
import com.eligibility.model.enums.BenefitType;
import com.eligibility.model.enums.EmploymentStatus;
import com.eligibility.repository.EligibilityAssessmentRepository;
import com.eligibility.service.strategy.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EligibilityServiceTest {

    @Mock private ApplicantService applicantService;
    @Mock private EligibilityAssessmentRepository assessmentRepository;

    private EligibilityService eligibilityService;

    private Applicant unemployedApplicant;

    @BeforeEach
    void setUp() {
        List<BenefitEligibilityStrategy> strategies = List.of(
                new JobseekerAllowanceStrategy(),
                new HousingAssistanceStrategy(),
                new DisabilitySupportStrategy(),
                new FamilyTaxCreditStrategy(),
                new EmergencyReliefStrategy()
        );
        eligibilityService = new EligibilityService(applicantService, assessmentRepository, strategies);

        unemployedApplicant = Applicant.builder()
                .id(1L)
                .firstName("Jane")
                .lastName("Smith")
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

    @Test
    @DisplayName("assessAll persists one assessment per benefit type")
    void assessAll_persistsAllFiveBenefitTypes() {
        when(applicantService.findById(1L)).thenReturn(unemployedApplicant);
        EligibilityAssessment mockSaved = EligibilityAssessment.builder()
                .id(99L)
                .applicant(unemployedApplicant)
                .benefitType(BenefitType.JOBSEEKER_ALLOWANCE)
                .eligible(true)
                .reasoning("ELIGIBLE.")
                .build();
        when(assessmentRepository.save(any())).thenReturn(mockSaved);

        EligibilityReportResponse report = eligibilityService.assessAll(1L);

        assertThat(report.getTotalBenefitsAssessed()).isEqualTo(5);
        verify(assessmentRepository, times(5)).save(any());
    }

    @Test
    @DisplayName("unemployed low-income applicant is eligible for Jobseeker Allowance")
    void assessAll_unemployedLowIncome_eligibleForJobseeker() {
        when(applicantService.findById(1L)).thenReturn(unemployedApplicant);

        ArgumentCaptor<EligibilityAssessment> captor = ArgumentCaptor.forClass(EligibilityAssessment.class);
        EligibilityAssessment mockSaved = EligibilityAssessment.builder()
                .id(1L)
                .applicant(unemployedApplicant)
                .benefitType(BenefitType.JOBSEEKER_ALLOWANCE)
                .eligible(true)
                .reasoning("ELIGIBLE.")
                .build();
        when(assessmentRepository.save(any())).thenReturn(mockSaved);

        eligibilityService.assessAll(1L);

        verify(assessmentRepository, atLeastOnce()).save(captor.capture());
        EligibilityAssessment jobseekerResult = captor.getAllValues().stream()
                .filter(a -> a.getBenefitType() == BenefitType.JOBSEEKER_ALLOWANCE)
                .findFirst()
                .orElseThrow();

        assertThat(jobseekerResult.getEligible()).isTrue();
    }

    @Test
    @DisplayName("high-income applicant is not eligible for Jobseeker Allowance")
    void assessAll_highIncome_notEligibleForJobseeker() {
        Applicant richApplicant = Applicant.builder()
                .id(2L)
                .firstName("Bob")
                .lastName("Rich")
                .age(40)
                .annualIncome(new BigDecimal("80000"))
                .employmentStatus(EmploymentStatus.UNEMPLOYED)
                .householdSize(1)
                .dependentChildren(0)
                .hasDisability(false)
                .isVeteran(false)
                .isCaregiver(false)
                .build();

        when(applicantService.findById(2L)).thenReturn(richApplicant);
        ArgumentCaptor<EligibilityAssessment> captor = ArgumentCaptor.forClass(EligibilityAssessment.class);
        EligibilityAssessment mockSaved = EligibilityAssessment.builder()
                .id(2L)
                .applicant(richApplicant)
                .benefitType(BenefitType.JOBSEEKER_ALLOWANCE)
                .eligible(false)
                .reasoning("NOT ELIGIBLE.")
                .build();
        when(assessmentRepository.save(any())).thenReturn(mockSaved);

        eligibilityService.assessAll(2L);

        verify(assessmentRepository, atLeastOnce()).save(captor.capture());
        EligibilityAssessment jsResult = captor.getAllValues().stream()
                .filter(a -> a.getBenefitType() == BenefitType.JOBSEEKER_ALLOWANCE)
                .findFirst().orElseThrow();

        assertThat(jsResult.getEligible()).isFalse();
    }
}
