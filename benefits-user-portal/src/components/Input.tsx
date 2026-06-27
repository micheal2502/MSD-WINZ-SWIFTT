import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
      {label}
    </label>
    <input
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
        transition: 'border-color 0.15s',
        ...props.style,
      }}
      onFocus={e => { e.currentTarget.style.borderColor = '#3B82F6'; }}
      onBlur={e => { e.currentTarget.style.borderColor = error ? '#FCA5A5' : '#D1D5DB'; }}
    />
    {error && <div style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{error}</div>}
  </div>
);
