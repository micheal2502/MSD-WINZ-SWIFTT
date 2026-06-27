package com.eligibility.config;

import com.eligibility.model.Applicant;
import com.eligibility.model.User;
import com.eligibility.model.enums.ApplicationStatus;
import com.eligibility.model.enums.EmploymentStatus;
import com.eligibility.model.enums.UserRole;
import com.eligibility.repository.ApplicantRepository;
import com.eligibility.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ApplicantRepository applicantRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmins();
        seedMockApplicants();
    }

    // ── Admin accounts ────────────────────────────────────────────────────────

    private void seedAdmins() {
        List<AdminSeed> admins = List.of(
            new AdminSeed("admin@winz.govt.nz",    "Admin@1234", "Sarah",  "Thompson"),
            new AdminSeed("caseworker@winz.govt.nz","Admin@1234", "David",  "Nguyen")
        );

        for (AdminSeed a : admins) {
            if (!userRepository.existsByEmail(a.email)) {
                userRepository.save(User.builder()
                    .email(a.email)
                    .password(passwordEncoder.encode(a.password))
                    .firstName(a.firstName)
                    .lastName(a.lastName)
                    .role(UserRole.ADMIN)
                    .build());
                log.info("Seeded admin account: {}", a.email);
            }
        }
    }

    // ── Mock applicants ───────────────────────────────────────────────────────

    private void seedMockApplicants() {
        if (applicantRepository.count() > 0) return; // already seeded

        List<MockApplicant> mocks = List.of(
            MockApplicant.builder()
                .email("maria.santos@example.com").password("User@1234")
                .firstName("Maria").lastName("Santos").age(34)
                .annualIncome(new BigDecimal("11500"))
                .employmentStatus(EmploymentStatus.UNEMPLOYED)
                .householdSize(3).dependentChildren(2)
                .hasDisability(false).isVeteran(false).isCaregiver(false)
                .build(),
            MockApplicant.builder()
                .email("james.okafor@example.com").password("User@1234")
                .firstName("James").lastName("Okafor").age(58)
                .annualIncome(new BigDecimal("28000"))
                .employmentStatus(EmploymentStatus.EMPLOYED_PART_TIME)
                .householdSize(1).dependentChildren(0)
                .hasDisability(true).isVeteran(false).isCaregiver(false)
                .build(),
            MockApplicant.builder()
                .email("priya.nair@example.com").password("User@1234")
                .firstName("Priya").lastName("Nair").age(29)
                .annualIncome(new BigDecimal("62000"))
                .employmentStatus(EmploymentStatus.EMPLOYED_FULL_TIME)
                .householdSize(2).dependentChildren(1)
                .hasDisability(false).isVeteran(false).isCaregiver(false)
                .build(),
            MockApplicant.builder()
                .email("derek.walsh@example.com").password("User@1234")
                .firstName("Derek").lastName("Walsh").age(45)
                .annualIncome(new BigDecimal("8000"))
                .employmentStatus(EmploymentStatus.UNEMPLOYED)
                .householdSize(1).dependentChildren(0)
                .hasDisability(false).isVeteran(true).isCaregiver(false)
                .build(),
            MockApplicant.builder()
                .email("sue.chen@example.com").password("User@1234")
                .firstName("Sue").lastName("Chen").age(72)
                .annualIncome(new BigDecimal("14000"))
                .employmentStatus(EmploymentStatus.RETIRED)
                .householdSize(2).dependentChildren(0)
                .hasDisability(false).isVeteran(false).isCaregiver(true)
                .build(),
            MockApplicant.builder()
                .email("lena.muller@example.com").password("User@1234")
                .firstName("Lena").lastName("Müller").age(23)
                .annualIncome(new BigDecimal("9500"))
                .employmentStatus(EmploymentStatus.STUDENT)
                .householdSize(4).dependentChildren(3)
                .hasDisability(false).isVeteran(false).isCaregiver(false)
                .build()
        );

        for (MockApplicant m : mocks) {
            // Create user account
            User user = userRepository.existsByEmail(m.email)
                ? userRepository.findByEmail(m.email).get()
                : userRepository.save(User.builder()
                    .email(m.email)
                    .password(passwordEncoder.encode(m.password))
                    .firstName(m.firstName)
                    .lastName(m.lastName)
                    .role(UserRole.USER)
                    .build());

            // Create linked applicant profile
            if (applicantRepository.findByUserId(user.getId()).isEmpty()) {
                applicantRepository.save(Applicant.builder()
                    .user(user)
                    .firstName(m.firstName)
                    .lastName(m.lastName)
                    .age(m.age)
                    .annualIncome(m.annualIncome)
                    .employmentStatus(m.employmentStatus)
                    .householdSize(m.householdSize)
                    .dependentChildren(m.dependentChildren)
                    .hasDisability(m.hasDisability)
                    .isVeteran(m.isVeteran)
                    .isCaregiver(m.isCaregiver)
                    .applicationStatus(ApplicationStatus.PENDING)
                    .build());
                log.info("Seeded applicant: {} {}", m.firstName, m.lastName);
            }
        }
    }

    // ── Inner seed records ────────────────────────────────────────────────────

    private record AdminSeed(String email, String password, String firstName, String lastName) {}

    @lombok.Builder
    private static class MockApplicant {
        String email, password, firstName, lastName;
        int age, householdSize, dependentChildren;
        BigDecimal annualIncome;
        EmploymentStatus employmentStatus;
        boolean hasDisability, isVeteran, isCaregiver;
    }
}
