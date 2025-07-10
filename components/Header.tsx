
import React, { useContext } from 'react';
import { UserProfile } from '../types';
import { SunIcon, MoonIcon, Bars3Icon, UserCircleIcon } from './icons';
import { ThemeContext } from '../App';

interface HeaderProps {
  userProfile?: UserProfile;
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ userProfile, onToggleSidebar, isSidebarCollapsed }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="flex-shrink-0 bg-white dark:bg-gray-800 shadow-sm dark:border-b dark:border-gray-700">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-gray-500 rounded-md hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 rounded-full hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-primary-500"
          >
            {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
          </button>
          
          <div className="flex items-center space-x-3">
            {userProfile?.avatarUrl ? (
                <img className="w-8 h-8 rounded-full" src={userProfile.avatarUrl} alt="User avatar" />
            ) : (
                <UserCircleIcon className="w-8 h-8 text-gray-400" />
            )}
            <span className="hidden font-medium sm:block">{userProfile?.name || 'Guest'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
