import React, { useState } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/client';

interface Props {
  onSwitchToLogin: () => void;
}

export const SignupPage: React.FC<Props> = ({ onSwitchToLogin }) => {
  const { login } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email.includes('@')) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setServerError('');
    try {
      const data = await api.signup(form);
      login(data);
    } catch (err: any) {
      setServerError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, background: '#DBEAFE', borderRadius: 12, marginBottom: 16 }}>
            <ShieldCheck size={24} style={{ color: '#2563EB' }} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Create your account</h1>
          <p style={{ fontSize: 14, color: '#6B7280' }}>Apply for social support benefits online</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: '28px 32px' }}>
          {serverError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#DC2626' }}>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
              <Input label="First name" value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} error={errors.firstName} placeholder="Jane" />
              <Input label="Last name" value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} error={errors.lastName} placeholder="Smith" />
            </div>
            <Input label="Email address" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} error={errors.email} placeholder="jane@example.com" />
            <Input label="Password" type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} error={errors.password} placeholder="At least 6 characters" />

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '10px 16px', fontSize: 14, fontWeight: 600,
              background: loading ? '#93C5FD' : '#2563EB', color: '#fff',
              border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4,
            }}>
              {loading ? <><Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> Creating account…</> : 'Create account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#6B7280', marginTop: 20 }}>
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
              Sign in
            </button>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
