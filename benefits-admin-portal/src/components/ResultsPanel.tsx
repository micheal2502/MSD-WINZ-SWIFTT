import React from 'react';
import { ClipboardList, CheckCircle2, XCircle } from 'lucide-react';
import { AssessmentReport } from '../types';
import { BENEFIT_META } from '../data/benefitMeta';

interface Props {
  report: AssessmentReport | null;
  isLoading: boolean;
  error?: string;
}

export const ResultsPanel: React.FC<Props> = ({ report, isLoading, error }) => {
  if (isLoading) {
    return (
      <div style={{ padding: '24px 0', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
        Running assessment against the API…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '16px', background: '#FEF2F2', borderRadius: 8, fontSize: 13, color: '#DC2626' }}>
        {error}
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
        <ClipboardList size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
        <div style={{ fontSize: 14 }}>Run an assessment to see eligibility results</div>
      </div>
    );
  }

  const verdictColor =
    report.eligibleCount >= 3 ? '#15803D' :
    report.eligibleCount >= 1 ? '#B45309' : '#B91C1C';

  return (
    <div>
      <div style={{
        fontSize: 13,
        color: '#64748B',
        marginBottom: 12,
        padding: '8px 12px',
        background: '#F8FAFC',
        borderRadius: 6,
        borderLeft: `3px solid ${verdictColor}`,
      }}>
        {report.applicantName} qualifies for{' '}
        <strong style={{ color: verdictColor }}>
          {report.eligibleCount} of {report.totalBenefitsAssessed} benefits
        </strong>
      </div>

      <div>
        {report.assessments.map(result => {
          const meta = BENEFIT_META[result.benefitType];
          return (
            <div key={result.benefitType} style={{
              padding: '12px 0',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: meta.bgColor, color: meta.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {result.eligible
                  ? <CheckCircle2 size={17} />
                  : <XCircle size={17} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#0F172A' }}>{meta.label}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 4,
                    background: result.eligible ? '#DCFCE7' : '#FEE2E2',
                    color: result.eligible ? '#15803D' : '#B91C1C',
                  }}>
                    {result.eligible ? 'Eligible' : 'Not eligible'}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>
                  {result.reasoning.replace(/^(ELIGIBLE|NOT ELIGIBLE)\.\s?/, '')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
