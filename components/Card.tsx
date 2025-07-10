
import React from 'react';

interface CardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, value, change, changeType, icon }) => {
  const changeColor = changeType === 'positive' ? 'text-secondary-600 dark:text-secondary-400' : 'text-red-500 dark:text-red-400';
  const changeIcon = changeType === 'positive' ? '▲' : '▼';

  return (
    <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <p className={`text-sm font-semibold ${changeColor}`}>
              {changeIcon} {change}
            </p>
          )}
        </div>
        <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Card;
