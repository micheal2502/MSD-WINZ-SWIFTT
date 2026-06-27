import React from 'react';
import { ShieldCheck, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activePage: 'home' | 'apply' | 'results';
  onNavigate: (page: 'home' | 'apply' | 'results') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate }) => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header style={{
      background: '#fff',
      borderBottom: '1px solid #E5E7EB',
      position: 'sticky',
      top: 0,
      zIndex: 20,
    }}>
      <div style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: '0 24px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
          onClick={() => onNavigate('home')}>
          <ShieldCheck size={20} style={{ color: '#2563EB' }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Work & Income</span>
          <span style={{
            fontSize: 11, background: '#DBEAFE', color: '#1D4ED8',
            padding: '2px 6px', borderRadius: 4, fontWeight: 500,
          }}>Portal</span>
        </div>

        {isAuthenticated && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {(['home', 'apply', 'results'] as const).map(page => (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                style={{
                  padding: '6px 12px',
                  fontSize: 13,
                  fontWeight: activePage === page ? 600 : 400,
                  color: activePage === page ? '#2563EB' : '#6B7280',
                  background: activePage === page ? '#EFF6FF' : 'transparent',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {page === 'home' ? 'Dashboard' : page === 'apply' ? 'Apply' : 'My Results'}
              </button>
            ))}

            <div style={{ width: 1, height: 20, background: '#E5E7EB', margin: '0 8px' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: '#DBEAFE', color: '#1D4ED8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 600,
              }}>
                {user?.firstName[0]}{user?.lastName[0]}
              </div>
              <span style={{ fontSize: 13, color: '#374151' }}>{user?.firstName}</span>
              <button onClick={logout} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#9CA3AF', display: 'flex', alignItems: 'center',
                padding: 4, borderRadius: 4,
              }}>
                <LogOut size={16} />
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
