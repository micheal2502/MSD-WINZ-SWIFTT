package com.eligibility.service;

import com.eligibility.dto.ApplicantRequest;
import com.eligibility.dto.ApplicantResponse;
import com.eligibility.exception.ResourceNotFoundException;
import com.eligibility.model.Applicant;
import com.eligibility.repository.ApplicantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplicantService {

    private final ApplicantRepository applicantRepository;

    public ApplicantResponse createApplicant(ApplicantRequest request) {
        Applicant applicant = Applicant.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .age(request.getAge())
                .annualIncome(request.getAnnualIncome())
                .employmentStatus(request.getEmploymentStatus())
                .householdSize(request.getHouseholdSize())
                .dependentChildren(request.getDependentChildren())
                .hasDisability(request.getHasDisability())
                .isVeteran(request.getIsVeteran())
                .isCaregiver(request.getIsCaregiver())
                .build();
        return toResponse(applicantRepository.save(applicant));
    }

    @Transactional(readOnly = true)
    public ApplicantResponse getApplicant(Long id) {
        return toResponse(findById(id));
    }

    @Transactional(readOnly = true)
    public List<ApplicantResponse> getAllApplicants() {
        return applicantRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ApplicantResponse updateApplicant(Long id, ApplicantRequest request) {
        Applicant existing = findById(id);
        existing.setFirstName(request.getFirstName());
        existing.setLastName(request.getLastName());
        existing.setAge(request.getAge());
        existing.setAnnualIncome(request.getAnnualIncome());
        existing.setEmploymentStatus(request.getEmploymentStatus());
        existing.setHouseholdSize(request.getHouseholdSize());
        existing.setDependentChildren(request.getDependentChildren());
        existing.setHasDisability(request.getHasDisability());
        existing.setIsVeteran(request.getIsVeteran());
        existing.setIsCaregiver(request.getIsCaregiver());
        return toResponse(applicantRepository.save(existing));
    }

    public void deleteApplicant(Long id) {
        Applicant applicant = findById(id);
        applicantRepository.delete(applicant);
    }

    public Applicant findById(Long id) {
        return applicantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Applicant not found with id: " + id));
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
                .applicationStatus(a.getApplicationStatus())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
