
import React from 'react';
import { FinancialData, SIP } from '../types';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from './icons';

interface InvestmentsProps {
  data: FinancialData;
}

const SIPCard: React.FC<{ sip: SIP }> = ({ sip }) => {
  const isUnderperforming = sip.benchmarkComparison < 0;
  return (
    <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-l-4 ${isUnderperforming ? 'border-red-500' : 'border-secondary-500'}`}>
      <h4 className="font-bold text-lg text-gray-900 dark:text-white">{sip.name}</h4>
      <div className="mt-2 flex justify-between items-baseline">
        <span className="text-2xl font-semibold text-gray-800 dark:text-gray-100">₹{sip.currentValue.toLocaleString('en-IN')}</span>
        <span className={`font-semibold flex items-center ${sip.roiPercentage >= 0 ? 'text-secondary-600 dark:text-secondary-400' : 'text-red-500'}`}>
          {sip.roiPercentage >= 0 ? <ArrowTrendingUpIcon className="w-5 h-5 mr-1" /> : <ArrowTrendingDownIcon className="w-5 h-5 mr-1" />}
          {sip.roiPercentage.toFixed(2)}% ROI
        </span>
      </div>
      <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
        Benchmark Comparison: 
        <span className={`font-bold ${isUnderperforming ? 'text-red-500' : 'text-secondary-600'}`}>
          {' '}{sip.benchmarkComparison.toFixed(2)}%
        </span>
      </p>
      {isUnderperforming && <p className="text-xs mt-1 text-red-600 dark:text-red-400">This SIP is underperforming its benchmark.</p>}
    </div>
  );
};

const Investments: React.FC<InvestmentsProps> = ({ data }) => {
  const otherAssets = data.assets.filter(asset => asset.category !== 'SIP' && asset.category !== 'Savings');

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Investments</h1>
      
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">SIP Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.sips.map(sip => (
            <SIPCard key={sip.id} sip={sip} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Other Holdings</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value (₹)</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {otherAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{asset.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{asset.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right font-mono">{asset.value.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Investments;
