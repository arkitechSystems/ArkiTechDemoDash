import React, { useState, useEffect } from 'react';
import './App.css';
import { SettingsProvider } from './contexts/SettingsContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import IncomeStatementTwo from './components/IncomeStatementTwo';
import TrendedIS from './components/TrendedIS';
import BalanceSheetTrend from './components/BalanceSheetTrend';
import BalanceSheetActivity from './components/BalanceSheetActivity';
import Settings from './components/Settings';
import UserGuide from './components/UserGuide';
import MVA from './components/MVA';
import ImpactPreview from './components/ImpactPreview';
import AIChatWindow from './components/AIChatWindow';
import UpcomingModules from './components/UpcomingModules';
import ProForma from './components/ProForma';
import GLTransactions from './components/GLTransactions';
import ProjectionsImp from './components/ProjectionsImp';
import MyAccount from './components/MyAccount';
import MonthlyReportOptions from './components/MonthlyReportOptions';
import SubmitTicket from './components/SubmitTicket';
import HiddenLinks from './components/HiddenLinks';

type PageType = 'dashboard' | 'income-two' | 'balance-trend' | 'balance-activity' | 'settings' | 'test-trend' | 'mva' | 'impact-preview' | 'projections-imp' | 'user-guide' | 'pro-forma' | 'gl-transactions' | 'upcoming-modules' | 'my-account' | 'monthly-report-options' | 'submit-ticket';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showHiddenLinks, setShowHiddenLinks] = useState(false);

  // Keyboard shortcut handler for Ctrl+H+M
  useEffect(() => {
    if (!isAuthenticated) return;

    const keysPressed = new Set<string>();

    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed.add(event.key.toLowerCase());

      // Check if Ctrl + H + M are all pressed
      if (event.ctrlKey && keysPressed.has('h') && keysPressed.has('m')) {
        event.preventDefault();
        setShowHiddenLinks((prev) => !prev);
        keysPressed.clear(); // Clear after triggering
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.delete(event.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isAuthenticated]);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'income-two':
        return <IncomeStatementTwo />;
      case 'balance-trend':
        return <BalanceSheetTrend />;
      case 'balance-activity':
        return <BalanceSheetActivity />;
      case 'settings':
        return <Settings />;
      case 'test-trend':
        return <TrendedIS />;
      case 'mva':
        return <MVA />;
      case 'impact-preview':
        return <ImpactPreview />;
      case 'projections-imp':
        return <ProjectionsImp />;
      case 'user-guide':
        return <UserGuide />;
      case 'pro-forma':
        return <ProForma />;
      case 'gl-transactions':
        return <GLTransactions />;
      case 'upcoming-modules':
        return <UpcomingModules />;
      case 'my-account':
        return <MyAccount />;
      case 'monthly-report-options':
        return <MonthlyReportOptions />;
      case 'submit-ticket':
        return <SubmitTicket />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`app ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        collapsed={sidebarCollapsed}
        onAIChat={() => setShowAIChat(!showAIChat)}
        showAIChat={showAIChat}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <Header
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onCollapseSidebar={() => setSidebarCollapsed(true)}
      />

      <main className="content">
        {renderContent()}
        <footer className="app-footer">
          <p>Developed by ArkiTech Systems © {new Date().getFullYear()}</p>
        </footer>
      </main>

      {/* AI Chat Window */}
      {showAIChat && (
        <AIChatWindow onClose={() => setShowAIChat(false)} />
      )}

      {/* Hidden Links Modal */}
      {showHiddenLinks && (
        <HiddenLinks
          onPageChange={setCurrentPage}
          onClose={() => setShowHiddenLinks(false)}
        />
      )}
    </div>
  );
}

// Main App component with authentication
const App: React.FC = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;