package com.eligibility.controller;

import com.eligibility.dto.ApplicantRequest;
import com.eligibility.dto.ApplicantResponse;
import com.eligibility.service.ApplicantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/applicants")
@RequiredArgsConstructor
public class ApplicantController {

    private final ApplicantService applicantService;

    @PostMapping
    public ResponseEntity<ApplicantResponse> create(@Valid @RequestBody ApplicantRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(applicantService.createApplicant(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicantResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(applicantService.getApplicant(id));
    }

    @GetMapping
    public ResponseEntity<List<ApplicantResponse>> getAll() {
        return ResponseEntity.ok(applicantService.getAllApplicants());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApplicantResponse> update(@PathVariable Long id,
                                                     @Valid @RequestBody ApplicantRequest request) {
        return ResponseEntity.ok(applicantService.updateApplicant(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        applicantService.deleteApplicant(id);
        return ResponseEntity.noContent().build();
    }
}
