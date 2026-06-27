package com.eligibility.dto;

import com.eligibility.model.enums.EmploymentStatus;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ApplicantRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotNull(message = "Age is required")
    @Min(value = 0, message = "Age must be non-negative")
    @Max(value = 120, message = "Age must be realistic")
    private Integer age;

    @NotNull(message = "Annual income is required")
    @DecimalMin(value = "0.00", message = "Income must be non-negative")
    private BigDecimal annualIncome;

    @NotNull(message = "Employment status is required")
    private EmploymentStatus employmentStatus;

    @NotNull
    @Min(value = 1, message = "Household size must be at least 1")
    private Integer householdSize;

    @NotNull
    @Min(value = 0)
    private Integer dependentChildren;

    @NotNull
    private Boolean hasDisability;

    @NotNull
    private Boolean isVeteran;

    @NotNull
    private Boolean isCaregiver;
}
