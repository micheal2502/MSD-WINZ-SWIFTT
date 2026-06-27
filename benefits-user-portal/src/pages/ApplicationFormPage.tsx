import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { ApplicationRequest, EmploymentStatus } from '../types';
import * as api from '../api/client';

const EMPLOYMENT_OPTIONS: { value: EmploymentStatus; label: string }[] = [
  { value: 'EMPLOYED_FULL_TIME',          label: 'Employed full-time' },
  { value: 'EMPLOYED_PART_TIME',          label: 'Employed part-time' },
  { value: 'SELF_EMPLOYED',               label: 'Self-employed' },
  { value: 'UNEMPLOYED',                  label: 'Unemployed' },
  { value: 'UNABLE_TO_WORK_DISABILITY',   label: 'Unable to work due to disability' },
  { value: 'RETIRED',                     label: 'Retired' },
  { value: 'STUDENT',                     label: 'Student' },
  { value: 'CAREGIVER',                   label: 'Caregiver' },
];

const Checkbox: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, checked, onChange }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: '#374151', padding: '8px 0' }}>
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 18, height: 18, borderRadius: 4, flexShrink: 0,
        border: `2px solid ${checked ? '#2563EB' : '#D1D5DB'}`,
        background: checked ? '#2563EB' : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      {checked && <CheckCircle2 size={12} style={{ color: '#fff' }} />}
    </div>
    {label}
  </label>
);

interface Props {
  onSuccess: () => void;
}

export const ApplicationFormPage: React.FC<Props> = ({ onSuccess }) => {
  const [form, setForm] = useState<Partial<ApplicationRequest>>({
    hasDisability: false, isVeteran: false, isCaregiver: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  // Pre-fill if existing application
  useEffect(() => {
    api.getMyApplication().then(existing => {
      setForm({
        age: existing.age,
        annualIncome: existing.annualIncome,
        employmentStatus: existing.employmentStatus,
        householdSize: existing.householdSize,
        dependentChildren: existing.dependentChildren,
        hasDisability: existing.hasDisability,
        isVeteran: existing.isVeteran,
        isCaregiver: existing.isCaregiver,
      });
    }).catch(() => {});
  }, []);

  const set = (key: keyof ApplicationRequest, value: any) =>
    setForm(p => ({ ...p, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.age) e.age = 'Required';
    if (form.annualIncome === undefined || form.annualIncome === null) e.annualIncome = 'Required';
    if (!form.employmentStatus) e.employmentStatus = 'Required';
    if (!form.householdSize) e.householdSize = 'Required';
    if (form.dependentChildren === undefined) e.dependentChildren = 'Required';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setServerError('');
    try {
      await api.submitApplication(form as ApplicationRequest);
      setSuccess(true);
      setTimeout(() => onSuccess(), 1500);
    } catch (err: any) {
      setServerError(err.response?.data?.error || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: 24, textAlign: 'center' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <CheckCircle2 size={28} style={{ color: '#16A34A' }} />
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Application submitted</h2>
      <p style={{ fontSize: 14, color: '#6B7280' }}>Redirecting to your dashboard…</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Benefits application</h1>
      <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 32 }}>
        Fill in your details to find out which benefits you may be eligible for.
      </p>

      <form onSubmit={handleSubmit}>
        {serverError && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#DC2626' }}>
            {serverError}
          </div>
        )}

        {/* Section: Personal */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px 24px', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #F3F4F6' }}>
            Personal details
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Input label="Age" type="number" min={0} max={120}
              value={form.age ?? ''} onChange={e => set('age', parseInt(e.target.value))}
              error={errors.age} placeholder="e.g. 34" />
            <Input label="Annual income ($)" type="number" min={0}
              value={form.annualIncome ?? ''} onChange={e => set('annualIncome', parseFloat(e.target.value))}
              error={errors.annualIncome} placeholder="e.g. 28000" />
          </div>
          <Select label="Employment status"
            options={EMPLOYMENT_OPTIONS}
            value={form.employmentStatus ?? ''}
            onChange={e => set('employmentStatus', e.target.value as EmploymentStatus)}
            error={errors.employmentStatus} />
        </div>

        {/* Section: Household */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px 24px', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #F3F4F6' }}>
            Household composition
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Input label="Household size" type="number" min={1}
              value={form.householdSize ?? ''} onChange={e => set('householdSize', parseInt(e.target.value))}
              error={errors.householdSize} placeholder="e.g. 3" />
            <Input label="Dependent children" type="number" min={0}
              value={form.dependentChildren ?? ''} onChange={e => set('dependentChildren', parseInt(e.target.value))}
              error={errors.dependentChildren} placeholder="e.g. 2" />
          </div>
        </div>

        {/* Section: Additional */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #F3F4F6' }}>
            Additional circumstances
          </div>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 12 }}>Select all that apply to you</p>
          <Checkbox label="I have a documented disability" checked={!!form.hasDisability} onChange={v => set('hasDisability', v)} />
          <Checkbox label="I am a veteran" checked={!!form.isVeteran} onChange={v => set('isVeteran', v)} />
          <Checkbox label="I am a primary caregiver" checked={!!form.isCaregiver} onChange={v => set('isCaregiver', v)} />
        </div>

        <button type="submit" disabled={loading} style={{
          width: '100%', padding: '11px 16px', fontSize: 14, fontWeight: 600,
          background: loading ? '#93C5FD' : '#2563EB', color: '#fff',
          border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {loading ? <><Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> Submitting…</> : 'Submit application'}
        </button>
      </form>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
