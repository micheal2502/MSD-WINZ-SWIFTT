package com.eligibility.dto;

import com.eligibility.model.enums.EmploymentStatus;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ApplicationRequest {

    @NotNull @Min(0) @Max(120)
    private Integer age;

    @NotNull @DecimalMin("0.00")
    private BigDecimal annualIncome;

    @NotNull
    private EmploymentStatus employmentStatus;

    @NotNull @Min(1)
    private Integer householdSize;

    @NotNull @Min(0)
    private Integer dependentChildren;

    @NotNull
    private Boolean hasDisability;

    @NotNull
    private Boolean isVeteran;

    @NotNull
    private Boolean isCaregiver;
}
