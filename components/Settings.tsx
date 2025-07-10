
import React, { useContext } from 'react';
import { ThemeContext } from '../App';
import { FinancialData } from '../types';
import { SunIcon, MoonIcon, ArrowDownTrayIcon, LanguageIcon, BellIcon, ShieldCheckIcon } from './icons';

interface SettingsProps {
    data: FinancialData;
}

const Settings: React.FC<SettingsProps> = ({ data }) => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    const handleExport = () => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(data, null, 2)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "financial_data.json";
        link.click();
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings & Privacy</h1>

            <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Preferences</h3>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    <div className="flex items-center justify-between py-4">
                        <label htmlFor="theme-toggle" className="flex items-center cursor-pointer">
                            {theme === 'light' ? <SunIcon className="w-5 h-5 mr-3 text-gray-500" /> : <MoonIcon className="w-5 h-5 mr-3 text-gray-400" />}
                            <span className="text-gray-700 dark:text-gray-300">Theme</span>
                        </label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" name="theme-toggle" id="theme-toggle" onChange={toggleTheme} checked={theme === 'dark'} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                            <label htmlFor="theme-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"></label>
                        </div>
                    </div>
                     <div className="flex items-center justify-between py-4">
                        <span className="flex items-center"><LanguageIcon className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" /> Language</span>
                        <div>
                             <button className="px-3 py-1 text-sm font-medium text-white bg-primary-500 border border-primary-500 rounded-l-md" disabled>English</button>
                             <button className="px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-t border-b border-r border-gray-300 dark:border-gray-600 rounded-r-md cursor-not-allowed" title="Coming Soon">हिन्दी</button>
                        </div>
                    </div>
                     <div className="flex items-center justify-between py-4">
                        <span className="flex items-center"><BellIcon className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" /> Notifications</span>
                        <button className="text-sm text-primary-500 hover:underline" title="Coming Soon">Configure</button>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Data & Privacy</h3>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    <div className="flex items-center justify-between py-4">
                        <span className="flex items-center"><ShieldCheckIcon className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" /> Connected Accounts</span>
                        <button className="text-sm text-primary-500 hover:underline" title="Coming Soon">Manage</button>
                    </div>
                    <div className="flex items-center justify-between py-4">
                        <span className="flex items-center"><ArrowDownTrayIcon className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" /> Export Your Data</span>
                         <button onClick={handleExport} className="px-4 py-2 text-sm font-semibold text-white bg-secondary-600 rounded-lg hover:bg-secondary-700">
                            Download as JSON
                        </button>
                    </div>
                </div>
            </div>
             <style>{`
                .toggle-checkbox:checked { right: 0; border-color: #2563eb; }
                .toggle-checkbox:checked + .toggle-label { background-color: #2563eb; }
            `}</style>
        </div>
    );
};

export default Settings;
