import { useState, useCallback } from 'react';
import { AssessmentReport } from '../types';
import * as api from '../api/client';

interface AssessmentState {
  reports: Record<number, AssessmentReport>;
  loading: Record<number, boolean>;
  errors: Record<number, string>;
}

export function useAssessment() {
  const [state, setState] = useState<AssessmentState>({
    reports: {},
    loading: {},
    errors: {},
  });

  const assess = useCallback(async (applicantId: number) => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, [applicantId]: true },
      errors: { ...prev.errors, [applicantId]: '' },
    }));

    try {
      const report = await api.runAssessment(applicantId);
      setState(prev => ({
        ...prev,
        reports: { ...prev.reports, [applicantId]: report },
        loading: { ...prev.loading, [applicantId]: false },
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, [applicantId]: false },
        errors: { ...prev.errors, [applicantId]: 'Assessment failed. Is the backend running?' },
      }));
    }
  }, []);

  const getReport = useCallback(
    (id: number) => state.reports[id] ?? null,
    [state.reports]
  );

  const isLoading = useCallback(
    (id: number) => state.loading[id] ?? false,
    [state.loading]
  );

  const getError = useCallback(
    (id: number) => state.errors[id] ?? '',
    [state.errors]
  );

  const totalAssessed = Object.keys(state.reports).length;

  const fullyEligible = Object.values(state.reports).filter(
    r => r.eligibleCount >= 3
  ).length;

  const eligibleCountByBenefit = Object.values(state.reports).reduce(
    (acc, report) => {
      report.assessments.forEach(r => {
        if (r.eligible) acc[r.benefitType] = (acc[r.benefitType] ?? 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>
  );

  const topBenefit =
    Object.entries(eligibleCountByBenefit).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return {
    assess,
    getReport,
    isLoading,
    getError,
    totalAssessed,
    fullyEligible,
    eligibleCountByBenefit,
    topBenefit,
  };
}
