import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, ClipboardList, ArrowRight } from 'lucide-react';
import { EligibilityReport } from '../types';
import * as api from '../api/client';

const BENEFIT_META: Record<string, { label: string; color: string; bg: string }> = {
  JOBSEEKER_ALLOWANCE: { label: 'Jobseeker Allowance',  color: '#185FA5', bg: '#E6F1FB' },
  HOUSING_ASSISTANCE:  { label: 'Housing Assistance',   color: '#0F6E56', bg: '#E1F5EE' },
  DISABILITY_SUPPORT:  { label: 'Disability Support',   color: '#534AB7', bg: '#EEEDFE' },
  FAMILY_TAX_CREDIT:   { label: 'Family Tax Credit',    color: '#993C1D', bg: '#FAECE7' },
  EMERGENCY_RELIEF:    { label: 'Emergency Relief',     color: '#854F0B', bg: '#FAEEDA' },
};

interface Props {
  onNavigate: (page: 'apply') => void;
}

export const ResultsPage: React.FC<Props> = ({ onNavigate }) => {
  const [report, setReport] = useState<EligibilityReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getMyResults()
      .then(setReport)
      .catch(err => {
        if (err.response?.status === 404) {
          setError('no-application');
        } else {
          setError('failed');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 80, color: '#9CA3AF' }}>Loading your results…</div>
  );

  if (error === 'no-application') return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: 24, textAlign: 'center' }}>
      <ClipboardList size={40} style={{ color: '#D1D5DB', marginBottom: 16 }} />
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111827', marginBottom: 8 }}>No application found</h2>
      <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>You need to submit an application before seeing results.</p>
      <button onClick={() => onNavigate('apply')} style={{
        padding: '10px 20px', background: '#2563EB', color: '#fff',
        border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
      }}>
        Start application <ArrowRight size={16} />
      </button>
    </div>
  );

  if (!report) return <div style={{ textAlign: 'center', padding: 80, color: '#EF4444' }}>Failed to load results.</div>;

  const verdictColor = report.eligibleCount >= 3 ? '#15803D' : report.eligibleCount >= 1 ? '#B45309' : '#B91C1C';

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Your eligibility results</h1>
      <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>
        Based on the details you provided, here is what you may qualify for.
      </p>

      {/* Summary banner */}
      <div style={{
        background: '#fff', border: `1px solid ${verdictColor}30`,
        borderLeft: `4px solid ${verdictColor}`,
        borderRadius: 10, padding: '14px 20px', marginBottom: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 2 }}>Assessment result</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: verdictColor }}>
            {report.eligibleCount} of {report.totalBenefitsAssessed} benefits — eligible
          </div>
        </div>
        <div style={{
          fontSize: 28, fontWeight: 800, color: verdictColor, opacity: 0.15,
        }}>
          {Math.round((report.eligibleCount / report.totalBenefitsAssessed) * 100)}%
        </div>
      </div>

      {/* Benefit results */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(report.assessments ?? []).map(result => {
          const meta = BENEFIT_META[result.benefitType];
          return (
            <div key={result.benefitType} style={{
              background: '#fff',
              border: `1px solid ${result.eligible ? '#BBF7D0' : '#FEE2E2'}`,
              borderRadius: 10,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 8,
                background: meta.bg, color: meta.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {result.eligible
                  ? <CheckCircle2 size={20} />
                  : <XCircle size={20} style={{ color: '#FCA5A5' }} />
                }
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>{meta.label}</div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                  {result.reasoning.replace(/^(ELIGIBLE|NOT ELIGIBLE)\.\s?/, '')}
                </div>
              </div>
              <span style={{
                fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 6,
                background: result.eligible ? '#DCFCE7' : '#FEE2E2',
                color: result.eligible ? '#15803D' : '#B91C1C',
                flexShrink: 0,
              }}>
                {result.eligible ? 'Eligible' : 'Not eligible'}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 24, padding: '14px 18px', background: '#F8FAFC', borderRadius: 8, fontSize: 13, color: '#6B7280' }}>
        These results are indicative only. A caseworker will review your application and confirm your eligibility.
      </div>
    </div>
  );
};
