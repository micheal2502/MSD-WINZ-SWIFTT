import React, { useEffect, useState } from 'react';
import { ClipboardList, CheckCircle2, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ApplicantResponse } from '../types';
import * as api from '../api/client';

interface Props {
  onNavigate: (page: 'apply' | 'results') => void;
}

const STATUS_CONFIG = {
  PENDING:  { label: 'Pending review',   color: '#D97706', bg: '#FEF3C7', icon: <Clock size={14} /> },
  ASSESSED: { label: 'Assessment done',  color: '#2563EB', bg: '#DBEAFE', icon: <ClipboardList size={14} /> },
  APPROVED: { label: 'Approved',         color: '#15803D', bg: '#DCFCE7', icon: <CheckCircle2 size={14} /> },
  DECLINED: { label: 'Declined',         color: '#DC2626', bg: '#FEE2E2', icon: <AlertCircle size={14} /> },
};

export const DashboardPage: React.FC<Props> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [application, setApplication] = useState<ApplicantResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyApplication()
      .then(setApplication)
      .catch(() => setApplication(null))
      .finally(() => setLoading(false));
  }, []);

  const statusCfg = application ? STATUS_CONFIG[application.applicationStatus] : null;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
        Welcome back, {user?.firstName}
      </h1>
      <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 32 }}>
        Manage your benefit application from here.
      </p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>Loading…</div>
      ) : application ? (
        <div>
          {/* Status card */}
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px 24px', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Application status</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 6, background: statusCfg?.bg, color: statusCfg?.color, fontSize: 13, fontWeight: 600 }}>
                  {statusCfg?.icon} {statusCfg?.label}
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                Submitted {new Date(application.createdAt).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px 24px', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 16 }}>Your details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px' }}>
              {[
                ['Annual income', `$${application.annualIncome.toLocaleString()}`],
                ['Employment', application.employmentStatus.replace(/_/g, ' ').toLowerCase()],
                ['Household size', String(application.householdSize)],
                ['Dependent children', String(application.dependentChildren)],
              ].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontSize: 12, color: '#9CA3AF' }}>{l}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#111827', textTransform: 'capitalize' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <button onClick={() => onNavigate('apply')} style={{ padding: '12px 16px', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 2 }}>Update application</div>
              <div style={{ fontSize: 12, color: '#9CA3AF' }}>Change your details</div>
            </button>
            <button onClick={() => onNavigate('results')} style={{ padding: '12px 16px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 10, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1D4ED8', marginBottom: 2 }}>View eligibility results</div>
                <div style={{ fontSize: 12, color: '#93C5FD' }}>See which benefits you qualify for</div>
              </div>
              <ArrowRight size={16} style={{ color: '#2563EB' }} />
            </button>
          </div>
        </div>
      ) : (
        /* No application yet */
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '40px 32px', textAlign: 'center' }}>
          <ClipboardList size={40} style={{ color: '#D1D5DB', marginBottom: 16 }} />
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 8 }}>No application yet</h2>
          <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>
            Submit your details to find out which benefits you may be eligible for.
          </p>
          <button onClick={() => onNavigate('apply')} style={{
            padding: '10px 24px', background: '#2563EB', color: '#fff',
            border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            Start application <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
