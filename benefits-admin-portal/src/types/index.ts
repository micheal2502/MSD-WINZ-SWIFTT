export type EmploymentStatus =
  | 'EMPLOYED_FULL_TIME'
  | 'EMPLOYED_PART_TIME'
  | 'SELF_EMPLOYED'
  | 'UNEMPLOYED'
  | 'UNABLE_TO_WORK_DISABILITY'
  | 'RETIRED'
  | 'STUDENT'
  | 'CAREGIVER';

export type BenefitType =
  | 'JOBSEEKER_ALLOWANCE'
  | 'HOUSING_ASSISTANCE'
  | 'DISABILITY_SUPPORT'
  | 'FAMILY_TAX_CREDIT'
  | 'EMERGENCY_RELIEF';

export type ApplicationStatus = 'PENDING' | 'ASSESSED' | 'APPROVED' | 'DECLINED';

// Matches the Spring Boot ApplicantResponse DTO
export interface Applicant {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  annualIncome: number;
  employmentStatus: EmploymentStatus;
  householdSize: number;
  dependentChildren: number;
  hasDisability: boolean;
  isVeteran: boolean;
  isCaregiver: boolean;
  applicationStatus: ApplicationStatus;
  createdAt: string;
}

export interface EligibilityRule {
  description: string;
  passed: boolean;
}

// Matches EligibilityAssessmentResponse from the API
export interface BenefitResult {
  id: number;
  applicantId: number;
  benefitType: BenefitType;
  eligible: boolean;
  reasoning: string;
  assessedAt: string;
}

// Matches EligibilityReportResponse from the API
export interface AssessmentReport {
  applicantId: number;
  applicantName: string;
  assessments: BenefitResult[];
  eligibleCount: number;
  totalBenefitsAssessed: number;
}
