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

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  applicantId: number | null;
}

export interface ApplicationRequest {
  age: number;
  annualIncome: number;
  employmentStatus: EmploymentStatus;
  householdSize: number;
  dependentChildren: number;
  hasDisability: boolean;
  isVeteran: boolean;
  isCaregiver: boolean;
}

export interface ApplicantResponse {
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

export interface BenefitResult {
  benefitType: BenefitType;
  eligible: boolean;
  reasoning: string;
  assessedAt: string;
}

export interface EligibilityReport {
  applicantId: number;
  applicantName: string;
  assessments: BenefitResult[];
  eligibleCount: number;
  totalBenefitsAssessed: number;
}
