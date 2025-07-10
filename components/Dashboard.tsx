
import React, { useMemo } from 'react';
import { FinancialData } from '../types';
import Card from './Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HomeIcon, PresentationChartLineIcon } from './icons';

interface DashboardProps {
  data: FinancialData;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="label font-bold">{`${label}`}</p>
        <p className="intro text-primary-500">{`Net Worth : ₹${payload[0].value.toLocaleString('en-IN')}`}</p>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const formattedNetWorthHistory = useMemo(() => {
    return data.netWorthHistory.map(item => ({
      ...item,
      // Format date to 'MMM YY' for display
      date: new Date(item.date).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
    }));
  }, [data.netWorthHistory]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          title="Net Worth"
          value={`₹${data.netWorth.toLocaleString('en-IN')}`}
          change={`${Math.abs(data.netWorthChange30d).toLocaleString('en-IN')} (30d)`}
          changeType={data.netWorthChange30d >= 0 ? 'positive' : 'negative'}
          icon={<HomeIcon className="w-6 h-6 text-primary-500" />}
        />
        <Card
          title="Credit Score"
          value={data.creditScore.toString()}
          icon={<PresentationChartLineIcon className="w-6 h-6 text-primary-500" />}
        />
        <Card
          title="Monthly Cashflow"
          value={`₹${data.monthlyCashflow.toLocaleString('en-IN')}`}
          changeType={data.monthlyCashflow >= 0 ? 'positive' : 'negative'}
          icon={<PresentationChartLineIcon className="w-6 h-6 text-primary-500" />}
        />
        <Card
          title="Top Investment"
          value={data.topInvestments[0].name}
          change={`${data.topInvestments[0].performance.toFixed(2)}%`}
          changeType={data.topInvestments[0].performance >= 0 ? 'positive' : 'negative'}
          icon={<PresentationChartLineIcon className="w-6 h-6 text-primary-500" />}
        />
      </div>

      {/* Net Worth Chart */}
      <div className="p-4 bg-white rounded-lg shadow-md sm:p-6 dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Net Worth Over Time</h2>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <LineChart
              data={formattedNetWorthHistory}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="date" stroke="rgb(156 163 175)" />
              <YAxis 
                stroke="rgb(156 163 175)"
                tickFormatter={(value) => `₹${Number(value) / 100000}L`} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="netWorth" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
