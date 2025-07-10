
import React, { useState, useMemo } from 'react';
import { FinancialData } from '../types';
import { CalculatorIcon } from './icons';

interface LoansProps {
  data: FinancialData;
}

const PrepaymentCalculator = () => {
    const [principal, setPrincipal] = useState(2000000);
    const [rate, setRate] = useState(8.5);
    const [tenure, setTenure] = useState(20);
    const [prepayment, setPrepayment] = useState(50000);

    const { originalEMI, newTenureMonths, yearsSaved, totalInterestSaved } = useMemo(() => {
        if (principal <= 0 || rate <= 0 || tenure <= 0) {
            return { originalEMI: 0, newTenureMonths: 0, yearsSaved: 0, totalInterestSaved: 0 };
        }
        
        const r = (rate / 12) / 100;
        const n = tenure * 12;

        const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalInterestWithoutPrepayment = emi * n - principal;

        if (prepayment <= 0) {
            return { originalEMI: emi, newTenureMonths: n, yearsSaved: 0, totalInterestSaved: 0 };
        }
        
        let newPrincipal = principal;
        let months = 0;
        let totalInterestWithPrepayment = 0;

        while (newPrincipal > 0) {
            months++;
            const interest = newPrincipal * r;
            const principalPaid = emi - interest;
            newPrincipal -= principalPaid;
            totalInterestWithPrepayment += interest;
            
            if (months % 12 === 0) {
              newPrincipal -= prepayment;
            }
            if (newPrincipal < 0) newPrincipal = 0;
        }

        const yearsSavedNum = tenure - months / 12;
        const interestSavedNum = totalInterestWithoutPrepayment - totalInterestWithPrepayment;

        return {
            originalEMI: emi,
            newTenureMonths: months,
            yearsSaved: yearsSavedNum > 0 ? yearsSavedNum : 0,
            totalInterestSaved: interestSavedNum > 0 ? interestSavedNum : 0,
        };
    }, [principal, rate, tenure, prepayment]);
    
    return (
        <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <div className="flex items-center mb-4">
                <CalculatorIcon className="w-6 h-6 mr-3 text-primary-500" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Loan Prepayment Calculator</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Loan Amount (₹)</label>
                        <input type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Interest Rate (% p.a.)</label>
                        <input type="number" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Original Tenure (Years)</label>
                        <input type="number" value={tenure} onChange={e => setTenure(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Yearly Prepayment (₹)</label>
                        <input type="number" step="1000" value={prepayment} onChange={e => setPrepayment(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                    </div>
                </div>
                <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-900 flex flex-col justify-center space-y-4">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Monthly EMI</p>
                        <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">₹{originalEMI.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">New Tenure</p>
                        <p className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">{(newTenureMonths / 12).toFixed(1)} years</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Time Saved</p>
                        <p className="text-xl font-bold text-secondary-600 dark:text-secondary-400">{yearsSaved.toFixed(1)} years</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Interest Saved</p>
                        <p className="text-xl font-bold text-secondary-600 dark:text-secondary-400">₹{totalInterestSaved.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}


const Loans: React.FC<LoansProps> = ({ data }) => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Loans & Liabilities</h1>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Outstanding Liabilities</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Outstanding Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {data.liabilities.map((liability) => (
                <tr key={liability.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{liability.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{liability.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right font-mono">{liability.value.toLocaleString('en-IN')}</td>
                </tr>
              ))}
              {data.liabilities.length === 0 && (
                <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No outstanding liabilities. Great job!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <PrepaymentCalculator />
    </div>
  );
};

export default Loans;
