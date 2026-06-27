import { BenefitType } from '../types';

export interface BenefitMeta {
  label: string;
  shortLabel: string;
  color: string;
  bgColor: string;
  description: string;
}

export const BENEFIT_META: Record<BenefitType, BenefitMeta> = {
  JOBSEEKER_ALLOWANCE: {
    label: 'Jobseeker Allowance',
    shortLabel: 'Jobseeker',
    color: '#185FA5',
    bgColor: '#E6F1FB',
    description: 'Support for unemployed individuals actively seeking work.',
  },
  HOUSING_ASSISTANCE: {
    label: 'Housing Assistance',
    shortLabel: 'Housing',
    color: '#0F6E56',
    bgColor: '#E1F5EE',
    description: 'Income-tested rental and housing cost support.',
  },
  DISABILITY_SUPPORT: {
    label: 'Disability Support',
    shortLabel: 'Disability',
    color: '#534AB7',
    bgColor: '#EEEDFE',
    description: 'Pension for those unable or limited in their capacity to work.',
  },
  FAMILY_TAX_CREDIT: {
    label: 'Family Tax Credit',
    shortLabel: 'Family Tax',
    color: '#993C1D',
    bgColor: '#FAECE7',
    description: 'Tax credit for families with dependent children.',
  },
  EMERGENCY_RELIEF: {
    label: 'Emergency Relief',
    shortLabel: 'Emergency',
    color: '#854F0B',
    bgColor: '#FAEEDA',
    description: 'Broad safety-net for individuals facing acute hardship.',
  },
};
