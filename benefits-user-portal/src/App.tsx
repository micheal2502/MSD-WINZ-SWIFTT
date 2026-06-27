import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ApplicationFormPage } from './pages/ApplicationFormPage';
import { ResultsPage } from './pages/ResultsPage';

type AuthPage = 'login' | 'signup';
type AppPage = 'home' | 'apply' | 'results';

const AppInner: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [authPage, setAuthPage] = useState<AuthPage>('signup');
  const [appPage, setAppPage] = useState<AppPage>('home');

  if (!isAuthenticated) {
    return authPage === 'signup'
      ? <SignupPage onSwitchToLogin={() => setAuthPage('login')} />
      : <LoginPage onSwitchToSignup={() => setAuthPage('signup')} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      <Navbar activePage={appPage} onNavigate={setAppPage} />
      {appPage === 'home'    && <DashboardPage onNavigate={setAppPage} />}
      {appPage === 'apply'   && <ApplicationFormPage onSuccess={() => setAppPage('home')} />}
      {appPage === 'results' && <ResultsPage onNavigate={setAppPage} />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
