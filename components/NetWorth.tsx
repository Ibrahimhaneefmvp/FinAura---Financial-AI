
import React, { useMemo, useState, useContext } from 'react';
import { FinancialData, Asset, Liability } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ThemeContext } from '../App';

const COLORS_ASSETS = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'];
const COLORS_LIABILITIES = ['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'];
const DARK_COLORS_ASSETS = ['#059669', '#047857', '#065f46', '#064e3b', '#022c22'];
const DARK_COLORS_LIABILITIES = ['#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#450a0a'];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-bold">{`${payload[0].name}: ₹${payload[0].value.toLocaleString('en-IN')}`}</p>
      </div>
    );
  }
  return null;
};

const DataTable = <T extends {id: string; name: string; value: number; category: string}>({ title, data, colors }: { title: string; data: T[]; colors: string[]}) => (
    <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">{title}</h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value (₹)</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                <span className="flex items-center">
                                    <span className="h-2 w-2 rounded-full mr-3" style={{ backgroundColor: colors[index % colors.length] }}></span>
                                    {item.name}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right font-mono">{item.value.toLocaleString('en-IN')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const NetWorth: React.FC<{ data: FinancialData }> = ({ data }) => {
  const { theme } = useContext(ThemeContext);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalAssets = useMemo(() => data.assets.reduce((sum, asset) => sum + asset.value, 0), [data.assets]);
  const totalLiabilities = useMemo(() => data.liabilities.reduce((sum, liability) => sum + liability.value, 0), [data.liabilities]);

  const pieData = [
    { name: 'Assets', value: totalAssets },
    { name: 'Liabilities', value: totalLiabilities },
  ];

  const pieColors = theme === 'dark' ? [DARK_COLORS_ASSETS[0], DARK_COLORS_LIABILITIES[0]] : [COLORS_ASSETS[0], COLORS_LIABILITIES[0]];
  const assetColors = theme === 'dark' ? DARK_COLORS_ASSETS : COLORS_ASSETS;
  const liabilityColors = theme === 'dark' ? DARK_COLORS_LIABILITIES : COLORS_LIABILITIES;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Net Worth Breakdown</h1>
      
      <div className="p-4 bg-white rounded-lg shadow-md sm:p-6 dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Assets vs. Liabilities</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" 
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
         <DataTable title="Assets" data={data.assets} colors={assetColors} />
         <DataTable title="Liabilities" data={data.liabilities} colors={liabilityColors} />
      </div>
    </div>
  );
};

export default NetWorth;
