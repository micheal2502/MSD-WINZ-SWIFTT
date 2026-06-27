import React, { useState, useEffect } from 'react';
import { LayoutDashboard, LogIn, Loader2, RefreshCw } from 'lucide-react';
import { Applicant } from './types';
import { BENEFIT_META } from './data/benefitMeta';
import { useAssessment } from './hooks/useAssessment';
import { MetricCard } from './components/MetricCard';
import { ApplicantCard } from './components/ApplicantCard';
import { ProfilePanel } from './components/ProfilePanel';
import { ResultsPanel } from './components/ResultsPanel';
import { EligibilityChart } from './components/EligibilityChart';
import * as api from './api/client';
import './App.css';

// ── Admin Login ───────────────────────────────────────────────────────────────
const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.adminLogin(email, password);
      onLogin();
    } catch {
      setError('Invalid credentials. Log in with an account that has ADMIN role.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <LayoutDashboard size={32} style={{ color: '#2563EB', marginBottom: 10 }} />
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>Admin Portal</h1>
          <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Benefits Eligibility System</p>
        </div>
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '28px 32px' }}>
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#DC2626' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="admin@example.com"
                style={{ width: '100%', padding: '9px 12px', fontSize: 14, border: '1px solid #D1D5DB', borderRadius: 8, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password"
                style={{ width: '100%', padding: '9px 12px', fontSize: 14, border: '1px solid #D1D5DB', borderRadius: 8, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '10px', fontSize: 14, fontWeight: 600,
              background: loading ? '#93C5FD' : '#2563EB', color: '#fff',
              border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {loading ? <><Loader2 size={15} style={{ animation: 'spin 0.7s linear infinite' }} />Signing in…</> : <><LogIn size={15} />Sign in</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ── Main Dashboard ────────────────────────────────────────────────────────────
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('adminToken'));
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const {
    assess, getReport, isLoading, getError,
    totalAssessed, fullyEligible, eligibleCountByBenefit, topBenefit,
  } = useAssessment();

  const loadApplicants = async () => {
    setLoadingApplicants(true);
    setFetchError('');
    try {
      const data = await api.fetchApplicants();
      setApplicants(data);
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 401) {
        setFetchError('Session expired — please sign in again.');
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
      } else if (status === 403) {
        setFetchError('Access denied. This account does not have admin privileges.');
      } else if (!err.response) {
        setFetchError('Cannot reach the backend. Make sure Docker is running: docker compose up');
      } else {
        setFetchError(`Error ${status}: ${err.response?.data?.error ?? 'Failed to load applicants.'}`);
      }
    } finally {
      setLoadingApplicants(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadApplicants();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const selectedApplicant = applicants.find(a => a.id === selectedId) ?? null;
  const selectedReport = selectedId ? getReport(selectedId) : null;
  const selectedLoading = selectedId ? isLoading(selectedId) : false;
  const selectedError = selectedId ? getError(selectedId) : '';
  const topBenefitLabel = topBenefit ? BENEFIT_META[topBenefit as keyof typeof BENEFIT_META]?.shortLabel : '—';

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LayoutDashboard size={20} style={{ color: '#2563EB' }} />
            <span style={{ fontSize: 16, fontWeight: 600, color: '#0F172A' }}>Benefits Eligibility</span>
            <span style={{ fontSize: 11, background: '#FEF3C7', color: '#92400E', padding: '2px 7px', borderRadius: 4, fontWeight: 600 }}>Admin</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#94A3B8' }}>
              {applicants.length} applicant{applicants.length !== 1 ? 's' : ''} in database
            </span>
            <button onClick={loadApplicants} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px',
              fontSize: 12, background: '#F1F5F9', border: '1px solid #E2E8F0',
              borderRadius: 6, cursor: 'pointer', color: '#475569',
            }}>
              <RefreshCw size={12} /> Refresh
            </button>
            <button onClick={() => { localStorage.removeItem('adminToken'); setIsAuthenticated(false); }}
              style={{ fontSize: 12, color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="metrics-grid">
          <MetricCard label="Total applicants" value={loadingApplicants ? '…' : applicants.length} />
          <MetricCard label="Assessments run" value={totalAssessed} />
          <MetricCard label="Fully eligible" value={totalAssessed > 0 ? fullyEligible : '—'} sub="≥ 3 benefits" />
          <MetricCard label="Top benefit" value={topBenefitLabel} sub="by eligible count" />
        </div>

        {fetchError && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#DC2626' }}>
            {fetchError}
          </div>
        )}

        <div className="body-grid">
          <aside className="sidebar">
            <div className="panel">
              <div className="panel-title">Applicants</div>
              {loadingApplicants ? (
                <div style={{ textAlign: 'center', padding: 24, color: '#94A3B8', fontSize: 13 }}>
                  <Loader2 size={20} style={{ animation: 'spin 0.7s linear infinite', marginBottom: 8 }} />
                  <div>Loading from API…</div>
                </div>
              ) : applicants.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 24, color: '#94A3B8', fontSize: 13 }}>
                  No applicants yet. Users sign up at localhost:3000.
                </div>
              ) : (
                applicants.map(a => (
                  <ApplicantCard
                    key={a.id}
                    applicant={a}
                    isSelected={selectedId === a.id}
                    report={getReport(a.id)}
                    onClick={() => setSelectedId(a.id)}
                  />
                ))
              )}
            </div>
          </aside>

          <div className="right-col">
            <div className="panel">
              <div className="panel-title">Applicant profile</div>
              <ProfilePanel
                applicant={selectedApplicant}
                isLoading={selectedLoading}
                hasReport={!!selectedReport}
                onAssess={() => selectedApplicant && assess(selectedApplicant.id)}
              />
            </div>

            <div className="panel">
              <div className="panel-title">Assessment results</div>
              <ResultsPanel
                report={selectedReport}
                isLoading={selectedLoading}
                error={selectedError}
              />
            </div>

            <div className="panel">
              <div className="panel-title">Eligible applicants by benefit type</div>
              <EligibilityChart eligibleCountByBenefit={eligibleCountByBenefit} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
