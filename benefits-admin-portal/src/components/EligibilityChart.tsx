import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { BenefitType } from '../types';
import { BENEFIT_META } from '../data/benefitMeta';

interface Props {
  eligibleCountByBenefit: Record<string, number>;
}

const ALL_BENEFITS: BenefitType[] = [
  'JOBSEEKER_ALLOWANCE',
  'HOUSING_ASSISTANCE',
  'DISABILITY_SUPPORT',
  'FAMILY_TAX_CREDIT',
  'EMERGENCY_RELIEF',
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    return (
      <div style={{
        background: '#fff',
        border: '1px solid #E2E8F0',
        borderRadius: 6,
        padding: '8px 12px',
        fontSize: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}>
        <div style={{ fontWeight: 600, color: '#0F172A', marginBottom: 2 }}>{d.label}</div>
        <div style={{ color: '#64748B' }}>{d.count} applicant{d.count !== 1 ? 's' : ''} eligible</div>
      </div>
    );
  }
  return null;
};

export const EligibilityChart: React.FC<Props> = ({ eligibleCountByBenefit }) => {
  const data = ALL_BENEFITS.map(type => ({
    key: type,
    label: BENEFIT_META[type].shortLabel,
    count: eligibleCountByBenefit[type] ?? 0,
    color: BENEFIT_META[type].color,
  }));

  const hasData = data.some(d => d.count > 0);

  if (!hasData) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 20px', color: '#94A3B8', fontSize: 13 }}>
        Assess applicants to populate this chart
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map(entry => (
            <Cell key={entry.key} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
