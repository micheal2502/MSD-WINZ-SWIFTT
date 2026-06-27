package com.eligibility.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthDtos {

    @Data
    public static class SignupRequest {
        @NotBlank @Email
        private String email;

        @NotBlank @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        @NotBlank
        private String firstName;

        @NotBlank
        private String lastName;
    }

    @Data
    public static class LoginRequest {
        @NotBlank @Email
        private String email;

        @NotBlank
        private String password;
    }

    @Data
    @lombok.Builder
    public static class AuthResponse {
        private String token;
        private Long userId;
        private String email;
        private String firstName;
        private String lastName;
        private String role;
        private Long applicantId;
    }
}
