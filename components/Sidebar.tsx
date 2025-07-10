
import React from 'react';
import { NavItem, ViewType } from '../types';
import { RocketLaunchIcon } from './icons';

interface SidebarProps {
  navItems: NavItem[];
  activeView: ViewType;
  setView: (view: ViewType) => void;
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, activeView, setView, isCollapsed }) => {
  return (
    <aside
      className={`flex flex-col bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className={`flex items-center h-16 px-4 border-b dark:border-gray-700 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
        <RocketLaunchIcon className="w-8 h-8 text-primary-500" />
        {!isCollapsed && (
          <span className="ml-3 text-xl font-bold text-gray-800 dark:text-white">Fi Agent</span>
        )}
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setView(item.id);
            }}
            className={`flex items-center p-2 text-base font-normal rounded-lg transition-colors duration-150
              ${
                activeView === item.id
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <item.icon className="w-6 h-6" />
            {!isCollapsed && <span className="ml-3">{item.label}</span>}
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
