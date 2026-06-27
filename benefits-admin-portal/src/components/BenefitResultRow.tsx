import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { BenefitResult } from '../types';
import { BENEFIT_META } from '../data/benefitMeta';

interface Props {
  result: BenefitResult;
}

export const BenefitResultRow: React.FC<Props> = ({ result }) => {
  const meta = BENEFIT_META[result.benefitType];

  // Parse reasoning string from the API into readable lines
  // Format: "ELIGIBLE. Passed: rule1; rule2. Failed: rule3."
  const cleanReasoning = result.reasoning
    .replace(/^(ELIGIBLE|NOT ELIGIBLE)\.\s?/, '')
    .replace(/Passed:\s?/, '✓ ')
    .replace(/Failed:\s?/, '✗ ');

  return (
    <div style={{
      padding: '14px 0',
      borderBottom: '1px solid #F1F5F9',
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 8,
        background: meta.bgColor, color: meta.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, fontSize: 16,
      }}>
        {result.eligible ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#0F172A' }}>{meta.label}</span>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 4,
            background: result.eligible ? '#DCFCE7' : '#FEE2E2',
            color: result.eligible ? '#15803D' : '#B91C1C',
          }}>
            {result.eligible ? 'Eligible' : 'Not eligible'}
          </span>
        </div>
        <div style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.5 }}>
          {cleanReasoning}
        </div>
      </div>
    </div>
  );
};
