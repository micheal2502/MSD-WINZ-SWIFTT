package com.eligibility.controller;

import com.eligibility.dto.ApplicationRequest;
import com.eligibility.dto.ApplicantResponse;
import com.eligibility.dto.EligibilityReportResponse;
import com.eligibility.model.Applicant;
import com.eligibility.model.User;
import com.eligibility.model.enums.ApplicationStatus;
import com.eligibility.repository.ApplicantRepository;
import com.eligibility.service.AuthService;
import com.eligibility.service.EligibilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/my")
@RequiredArgsConstructor
public class UserApplicationController {

    private final AuthService authService;
    private final ApplicantRepository applicantRepository;
    private final EligibilityService eligibilityService;

    /**
     * POST /api/v1/my/application
     * Submit or update the logged-in user's benefit application.
     */
    @PostMapping("/application")
    public ResponseEntity<ApplicantResponse> submitApplication(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody ApplicationRequest request) {

        User user = authService.getUserByEmail(email);

        // Upsert — update if already exists
        Applicant applicant = applicantRepository.findByUserId(user.getId())
                .orElse(Applicant.builder()
                        .user(user)
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .build());

        applicant.setAge(request.getAge());
        applicant.setAnnualIncome(request.getAnnualIncome());
        applicant.setEmploymentStatus(request.getEmploymentStatus());
        applicant.setHouseholdSize(request.getHouseholdSize());
        applicant.setDependentChildren(request.getDependentChildren());
        applicant.setHasDisability(request.getHasDisability());
        applicant.setIsVeteran(request.getIsVeteran());
        applicant.setIsCaregiver(request.getIsCaregiver());
        applicant.setApplicationStatus(ApplicationStatus.PENDING);

        Applicant saved = applicantRepository.save(applicant);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
    }

    /**
     * GET /api/v1/my/application
     * Get the logged-in user's application status and details.
     */
    @GetMapping("/application")
    public ResponseEntity<ApplicantResponse> getMyApplication(@AuthenticationPrincipal String email) {
        User user = authService.getUserByEmail(email);
        return applicantRepository.findByUserId(user.getId())
                .map(a -> ResponseEntity.ok(toResponse(a)))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/v1/my/results
     * Get the logged-in user's eligibility assessment results.
     */
    @GetMapping("/results")
    public ResponseEntity<EligibilityReportResponse> getMyResults(@AuthenticationPrincipal String email) {
        User user = authService.getUserByEmail(email);
        return applicantRepository.findByUserId(user.getId())
                .map(a -> ResponseEntity.ok(eligibilityService.assessAll(a.getId())))
                .orElse(ResponseEntity.notFound().build());
    }

    private ApplicantResponse toResponse(Applicant a) {
        return ApplicantResponse.builder()
                .id(a.getId())
                .firstName(a.getFirstName())
                .lastName(a.getLastName())
                .age(a.getAge())
                .annualIncome(a.getAnnualIncome())
                .employmentStatus(a.getEmploymentStatus())
                .householdSize(a.getHouseholdSize())
                .dependentChildren(a.getDependentChildren())
                .hasDisability(a.getHasDisability())
                .isVeteran(a.getIsVeteran())
                .isCaregiver(a.getIsCaregiver())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
