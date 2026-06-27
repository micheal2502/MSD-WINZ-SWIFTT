import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, error, ...props }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
      {label}
    </label>
    <select
      {...props}
      style={{
        width: '100%',
        padding: '9px 12px',
        fontSize: 14,
        border: `1px solid ${error ? '#FCA5A5' : '#D1D5DB'}`,
        borderRadius: 8,
        outline: 'none',
        background: '#fff',
        color: '#111827',
        boxSizing: 'border-box',
        appearance: 'none',
        cursor: 'pointer',
      }}
    >
      <option value="">Select…</option>
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
    {error && <div style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{error}</div>}
  </div>
);
