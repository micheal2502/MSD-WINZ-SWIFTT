package com.eligibility.controller;

import com.eligibility.dto.ApplicantRequest;
import com.eligibility.dto.ApplicantResponse;
import com.eligibility.model.enums.EmploymentStatus;
import com.eligibility.service.ApplicantService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ApplicantController.class)
class ApplicantControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @MockBean  private ApplicantService applicantService;

    private ApplicantRequest validRequest() {
        ApplicantRequest r = new ApplicantRequest();
        r.setFirstName("Jane");
        r.setLastName("Smith");
        r.setAge(30);
        r.setAnnualIncome(new BigDecimal("12000"));
        r.setEmploymentStatus(EmploymentStatus.UNEMPLOYED);
        r.setHouseholdSize(1);
        r.setDependentChildren(0);
        r.setHasDisability(false);
        r.setIsVeteran(false);
        r.setIsCaregiver(false);
        return r;
    }

    private ApplicantResponse mockResponse(Long id) {
        return ApplicantResponse.builder()
                .id(id)
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
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("POST /api/v1/applicants → 201 Created with applicant body")
    void createApplicant_returnsCreated() throws Exception {
        when(applicantService.createApplicant(any())).thenReturn(mockResponse(1L));

        mockMvc.perform(post("/api/v1/applicants")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.firstName").value("Jane"))
                .andExpect(jsonPath("$.employmentStatus").value("UNEMPLOYED"));
    }

    @Test
    @DisplayName("POST /api/v1/applicants with missing firstName → 400 Bad Request")
    void createApplicant_missingFirstName_returns400() throws Exception {
        ApplicantRequest bad = validRequest();
        bad.setFirstName(null);

        mockMvc.perform(post("/api/v1/applicants")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bad)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.firstName").exists());
    }

    @Test
    @DisplayName("GET /api/v1/applicants/1 → 200 OK")
    void getApplicant_returnsOk() throws Exception {
        when(applicantService.getApplicant(1L)).thenReturn(mockResponse(1L));

        mockMvc.perform(get("/api/v1/applicants/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @DisplayName("DELETE /api/v1/applicants/1 → 204 No Content")
    void deleteApplicant_returnsNoContent() throws Exception {
        mockMvc.perform(delete("/api/v1/applicants/1"))
                .andExpect(status().isNoContent());
    }
}
