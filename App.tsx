
import React, { useState, useEffect, createContext, useCallback } from 'react';
import { ViewType, FinancialData, UserProfile } from './types';
import { NAV_ITEMS } from './constants';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import NetWorth from './components/NetWorth';
import Investments from './components/Investments';
import Loans from './components/Loans';
import Goals from './components/Goals';
import Settings from './components/Settings';
import InteractiveBackground from './components/InteractiveBackground';
import { fetchFinancialData } from './services/mcpService';

export const ThemeContext = createContext<{ theme: string; toggleTheme: () => void }>({
  theme: 'light',
  toggleTheme: () => {},
});

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('dashboard');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('light');
  const [data, setData] = useState<FinancialData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const localTheme = localStorage.getItem('theme') || 'light';
    setTheme(localTheme);
    document.documentElement.classList.toggle('dark', localTheme === 'dark');
    
    const loadData = async () => {
      try {
        setIsLoading(true);
        const financialData = await fetchFinancialData();
        setData(financialData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch financial data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      return newTheme;
    });
  }, []);

  const renderView = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin-slow border-primary-500"></div>
        </div>
      );
    }
    if (error || !data) {
      return (
        <div className="flex items-center justify-center h-full text-red-500">
          <p>{error || 'An unexpected error occurred.'}</p>
        </div>
      );
    }

    switch (view) {
      case 'dashboard':
        return <Dashboard data={data} />;
      case 'chat':
        return <Chat financialDataSummary={JSON.stringify(data, null, 2)} />;
      case 'net-worth':
        return <NetWorth data={data} />;
      case 'investments':
        return <Investments data={data} />;
      case 'loans':
        return <Loans data={data} />;
      case 'goals':
        return <Goals />;
      case 'settings':
        return <Settings data={data} />;
      default:
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <h2 className="text-2xl font-bold">Page Not Found</h2>
                <p className="mt-2">The page you're looking for doesn't exist.</p>
            </div>
        );
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <InteractiveBackground />
      <div className="flex h-screen text-gray-800 dark:text-gray-200">
        <Sidebar 
          navItems={NAV_ITEMS} 
          activeView={view} 
          setView={setView} 
          isCollapsed={isSidebarCollapsed}
        />
        <div className="flex flex-col flex-1">
          <Header 
            userProfile={data?.userProfile}
            onToggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)}
            isSidebarCollapsed={isSidebarCollapsed}
          />
          <main className="flex-1 p-4 overflow-y-auto sm:p-6 lg:p-8">
            {renderView()}
          </main>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;