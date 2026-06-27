package com.eligibility.dto;

import com.eligibility.model.enums.ApplicationStatus;
import com.eligibility.model.enums.EmploymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ApplicantResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private Integer age;
    private BigDecimal annualIncome;
    private EmploymentStatus employmentStatus;
    private Integer householdSize;
    private Integer dependentChildren;
    private Boolean hasDisability;
    private Boolean isVeteran;
    private Boolean isCaregiver;
    private ApplicationStatus applicationStatus;
    private LocalDateTime createdAt;
}
