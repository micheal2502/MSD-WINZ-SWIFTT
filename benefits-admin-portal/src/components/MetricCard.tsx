import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, sub }) => (
  <div style={{
    background: 'var(--color-bg-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 10,
    padding: '14px 16px',
  }}>
    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--color-text)' }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{sub}</div>}
  </div>
);
