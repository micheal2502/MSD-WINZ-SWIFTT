import React from 'react';
import { Loader2, ClipboardCheck, ShieldCheck, Medal, Heart } from 'lucide-react';
import { Applicant } from '../types';

interface Props {
  applicant: Applicant | null;
  isLoading: boolean;
  hasReport: boolean;
  onAssess: () => void;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: '#64748B', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: '#0F172A', textTransform: 'capitalize' }}>{value}</div>
    </div>
  );
}

function formatStatus(status: string) {
  return status.replace(/_/g, ' ').toLowerCase();
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PENDING:  { bg: '#FEF3C7', color: '#92400E' },
  ASSESSED: { bg: '#DBEAFE', color: '#1E40AF' },
  APPROVED: { bg: '#DCFCE7', color: '#15803D' },
  DECLINED: { bg: '#FEE2E2', color: '#B91C1C' },
};

export const ProfilePanel: React.FC<Props> = ({ applicant, isLoading, hasReport, onAssess }) => {
  if (!applicant) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
        <ClipboardCheck size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
        <div style={{ fontSize: 14 }}>Select an applicant to get started</div>
      </div>
    );
  }

  const tags: { icon: React.ReactNode; label: string }[] = [];
  if (applicant.hasDisability) tags.push({ icon: <ShieldCheck size={12} />, label: 'Disability' });
  if (applicant.isVeteran) tags.push({ icon: <Medal size={12} />, label: 'Veteran' });
  if (applicant.isCaregiver) tags.push({ icon: <Heart size={12} />, label: 'Caregiver' });

  const statusCfg = applicant.applicationStatus
    ? STATUS_COLORS[applicant.applicationStatus]
    : null;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: '#DBEAFE', color: '#1D4ED8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 600, flexShrink: 0,
        }}>
          {applicant.firstName[0]}{applicant.lastName[0]}
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#0F172A' }}>
            {applicant.firstName} {applicant.lastName}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
            <span style={{ fontSize: 13, color: '#64748B' }}>Applicant #{applicant.id}</span>
            {statusCfg && (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '2px 7px',
                borderRadius: 4, background: statusCfg.bg, color: statusCfg.color,
              }}>
                {applicant.applicationStatus}
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px', marginBottom: 16 }}>
        <Field label="Age" value={applicant.age ? `${applicant.age} years` : '—'} />
        <Field label="Annual income" value={applicant.annualIncome ? `$${applicant.annualIncome.toLocaleString()}` : '—'} />
        <Field label="Employment" value={applicant.employmentStatus ? formatStatus(applicant.employmentStatus) : '—'} />
        <Field label="Household size" value={applicant.householdSize ? String(applicant.householdSize) : '—'} />
        <Field label="Dependent children" value={applicant.dependentChildren !== undefined ? String(applicant.dependentChildren) : '—'} />
      </div>

      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {tags.map(t => (
            <span key={t.label} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 12, fontWeight: 500, padding: '3px 8px',
              borderRadius: 4, background: '#F1F5F9', color: '#475569',
            }}>
              {t.icon}{t.label}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={onAssess}
        disabled={isLoading}
        style={{
          width: '100%', padding: '9px 16px', fontSize: 14, fontWeight: 500,
          background: isLoading ? '#93C5FD' : '#2563EB', color: '#fff',
          border: 'none', borderRadius: 8, cursor: isLoading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => { if (!isLoading) (e.currentTarget as HTMLElement).style.background = '#1D4ED8'; }}
        onMouseLeave={e => { if (!isLoading) (e.currentTarget as HTMLElement).style.background = '#2563EB'; }}
      >
        {isLoading
          ? <><Loader2 size={15} style={{ animation: 'spin 0.7s linear infinite' }} /> Assessing…</>
          : <><ClipboardCheck size={15} /> {hasReport ? 'Re-run assessment' : 'Run eligibility assessment'}</>
        }
      </button>
    </div>
  );
};
