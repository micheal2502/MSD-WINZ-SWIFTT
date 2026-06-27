# Benefits Eligibility API

A RESTful API built in **Java Spring Boot** that assesses applicant eligibility for social support programmes, modelling the core logic found in government social program management systems.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Spring Boot 3.2 |
| ORM | Hibernate / JPA |
| Database | PostgreSQL (H2 for tests) |
| Testing | JUnit 5 + Mockito |
| Containerisation | Docker + Docker Compose |
| CI/CD | GitHub Actions |

---

## Architecture

The application follows a strict **layered architecture**:

```
Controller  →  Service  →  Repository
                  ↓
          Strategy Engine
     (per-benefit-type rules)
```

### Design Patterns

**Strategy Pattern**: Each of the 5 benefit types has its own `BenefitEligibilityStrategy` implementation. Spring injects all strategies as a list; the service iterates them without needing a switch statement or if-else chain.

**Chain of Responsibility**: Each strategy composes a list of independent `EligibilityRule` objects. Rules are evaluated in sequence — each can independently pass or fail, and the final result collects all passed/failed rule descriptions for transparent reasoning.

---

## Benefit Types

| Benefit | Key Criteria |
|---|---|
| `JOBSEEKER_ALLOWANCE` | Unemployed + income < $15k + age 18–65 |
| `HOUSING_ASSISTANCE` | Income-tested (scales with dependents) + household ≥ 2 or disability |
| `DISABILITY_SUPPORT` | Disability flag + limited work capacity + income < $30k |
| `FAMILY_TAX_CREDIT` | Has dependents + income < $55k (+ $5k/child) |
| `EMERGENCY_RELIEF` | Income < $25k + any one vulnerability marker |

---

## API Endpoints

### Applicants

```
POST   /api/v1/applicants              Create applicant
GET    /api/v1/applicants              List all applicants
GET    /api/v1/applicants/{id}         Get applicant by ID
PUT    /api/v1/applicants/{id}         Update applicant
DELETE /api/v1/applicants/{id}         Delete applicant
```

### Eligibility

```
POST /api/v1/eligibility/applicants/{id}/assess              Run full assessment (all 5 benefit types)
POST /api/v1/eligibility/applicants/{id}/assess/{benefitType} Assess a single benefit type
GET  /api/v1/eligibility/applicants/{id}/assessments         Retrieve all stored assessments
GET  /api/v1/eligibility/applicants/{id}/eligible            Retrieve eligible benefits only
```

---

## Running Locally

### With Docker Compose (recommended)

```bash
docker compose up --build
```

This starts PostgreSQL and the Spring Boot application. The API is available at `http://localhost:8080`.

### Without Docker

```bash
# Requires a local PostgreSQL instance
export DB_URL=jdbc:postgresql://localhost:5432/benefits_db
export DB_USERNAME=postgres
export DB_PASSWORD=postgres

./mvnw spring-boot:run
```

---

## Running Tests

```bash
./mvnw test
```

Tests use an H2 in-memory database — no external dependencies needed.

---

## Example Request

```bash
# 1. Create an applicant
curl -X POST http://localhost:8080/api/v1/applicants \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "age": 30,
    "annualIncome": 12000,
    "employmentStatus": "UNEMPLOYED",
    "householdSize": 1,
    "dependentChildren": 0,
    "hasDisability": false,
    "isVeteran": false,
    "isCaregiver": false
  }'

# 2. Run full eligibility assessment
curl -X POST http://localhost:8080/api/v1/eligibility/applicants/1/assess
```

### Example Response

```json
{
  "applicantId": 1,
  "applicantName": "Jane Smith",
  "totalBenefitsAssessed": 5,
  "eligibleCount": 2,
  "assessments": [
    {
      "benefitType": "JOBSEEKER_ALLOWANCE",
      "eligible": true,
      "reasoning": "ELIGIBLE. Passed: Employment status must be UNEMPLOYED; Annual income must be below $15000; Applicant must be between 18 and 65 years old."
    },
    {
      "benefitType": "EMERGENCY_RELIEF",
      "eligible": true,
      "reasoning": "ELIGIBLE. Passed: Annual income must be below $25000; Must have at least one vulnerability indicator..."
    }
  ]
}
```

---

## CI/CD

Every pull request to `main` triggers the GitHub Actions pipeline which:
1. Builds the application
2. Runs all unit and integration tests
3. Publishes a JUnit test report
4. Builds the Docker image (verifies the Dockerfile is not broken)
