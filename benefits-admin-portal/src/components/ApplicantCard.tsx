import React from 'react';
import { User } from 'lucide-react';
import { Applicant, AssessmentReport } from '../types';

interface Props {
  applicant: Applicant;
  isSelected: boolean;
  report: AssessmentReport | null;
  onClick: () => void;
}

function getEligibilityBadge(report: AssessmentReport | null) {
  if (!report) return null;
  const { eligibleCount } = report;
  if (eligibleCount >= 3) return { label: `${eligibleCount} eligible`, color: '#0F6E56', bg: '#E1F5EE' };
  if (eligibleCount >= 1) return { label: `${eligibleCount} eligible`, color: '#854F0B', bg: '#FAEEDA' };
  return { label: 'Not eligible', color: '#993C1D', bg: '#FAECE7' };
}

function formatStatus(status: string) {
  return status.replace(/_/g, ' ').toLowerCase();
}

export const ApplicantCard: React.FC<Props> = ({ applicant, isSelected, report, onClick }) => {
  const badge = getEligibilityBadge(report);
  const initials = `${applicant.firstName[0]}${applicant.lastName[0]}`;

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        textAlign: 'left',
        background: isSelected ? '#EFF6FF' : 'transparent',
        border: isSelected ? '1px solid #BFDBFE' : '1px solid transparent',
        borderRadius: 8,
        padding: '10px 12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 4,
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => {
        if (!isSelected) (e.currentTarget as HTMLElement).style.background = '#F8FAFC';
      }}
      onMouseLeave={e => {
        if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent';
      }}
    >
      <div style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: isSelected ? '#BFDBFE' : '#E2E8F0',
        color: isSelected ? '#1D4ED8' : '#475569',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
        fontWeight: 600,
        flexShrink: 0,
      }}>
        {initials}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#0F172A' }}>
          {applicant.firstName} {applicant.lastName}
        </div>
        <div style={{ fontSize: 12, color: '#64748B', marginTop: 1, textTransform: 'capitalize' }}>
          {applicant.age} yrs · {formatStatus(applicant.employmentStatus)}
        </div>
        {badge && (
          <span style={{
            display: 'inline-block',
            marginTop: 4,
            fontSize: 11,
            fontWeight: 500,
            padding: '2px 7px',
            borderRadius: 4,
            background: badge.bg,
            color: badge.color,
          }}>
            {badge.label}
          </span>
        )}
      </div>
    </button>
  );
};
