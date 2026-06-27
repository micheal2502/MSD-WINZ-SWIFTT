import React, { useState } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/client';

interface Props {
  onSwitchToSignup: () => void;
}

export const LoginPage: React.FC<Props> = ({ onSwitchToSignup }) => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api.login(form);
      login(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, background: '#DBEAFE', borderRadius: 12, marginBottom: 16 }}>
            <ShieldCheck size={24} style={{ color: '#2563EB' }} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Sign in</h1>
          <p style={{ fontSize: 14, color: '#6B7280' }}>Access your benefits application</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: '28px 32px' }}>
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#DC2626' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <Input label="Email address" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="jane@example.com" />
            <Input label="Password" type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Your password" />
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '10px 16px', fontSize: 14, fontWeight: 600,
              background: loading ? '#93C5FD' : '#2563EB', color: '#fff',
              border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4,
            }}>
              {loading ? <><Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> Signing in…</> : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#6B7280', marginTop: 20 }}>
            No account yet?{' '}
            <button onClick={onSwitchToSignup} style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
              Create one
            </button>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
