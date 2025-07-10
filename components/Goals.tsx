
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrophyIcon } from './icons';

const GoalPlanner = () => {
    const [target, setTarget] = useState(10000000); // 1 Crore
    const [years, setYears] = useState(15);
    const [rate, setRate] = useState(12);

    const monthlyInvestment = useMemo(() => {
        if (target <= 0 || years <= 0 || rate <= 0) return 0;
        const i = (rate / 100) / 12;
        const n = years * 12;
        const fv = target;

        const sip = fv / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
        return sip;
    }, [target, years, rate]);
    
    return (
        <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <div className="flex items-center mb-4">
                <TrophyIcon className="w-6 h-6 mr-3 text-primary-500" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Goal Planner</h3>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target Amount (₹)</label>
                        <input type="number" value={target} onChange={e => setTarget(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time to Achieve (Years)</label>
                        <input type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expected Annual Return (%)</label>
                        <input type="number" step="0.5" value={rate} onChange={e => setRate(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                    </div>
                </div>
                <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center text-center space-y-2">
                     <p className="text-lg text-gray-600 dark:text-gray-300">Required Monthly Investment (SIP)</p>
                     <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                        ₹{monthlyInvestment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                </div>
             </div>
        </div>
    );
};

const ScenarioSimulator = () => {
    const [sip, setSip] = useState(25000);
    const [years, setYears] = useState(20);
    const [rate, setRate] = useState(12);

    const { futureValue, chartData } = useMemo(() => {
        if(sip <= 0 || years <= 0) return { futureValue: 0, chartData: [] };

        const i = (rate / 100) / 12;
        
        const data = Array.from({length: years + 1}, (_, year) => {
            const currentN = year * 12;
            const value = currentN > 0 ? sip * (((Math.pow(1 + i, currentN) - 1) / i) * (1 + i)) : 0;
            return { year: `Year ${year}`, value: Math.round(value) };
        });
        
        const fv = data[data.length - 1].value;

        return { futureValue: fv, chartData: data };
    }, [sip, years, rate]);
    
    return (
        <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Investment Scenario Simulator</h3>
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Investment (₹{sip.toLocaleString('en-IN')})</label>
                        <input type="range" min="1000" max="100000" step="1000" value={sip} onChange={e => setSip(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-primary-500" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Investment Period ({years} years)</label>
                        <input type="range" min="1" max="40" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-primary-500" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expected Return ({rate}% p.a.)</label>
                        <input type="range" min="1" max="25" step="0.5" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-primary-500" />
                    </div>
                    <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/50 text-center">
                        <p className="text-lg text-gray-600 dark:text-gray-300">Projected Future Value</p>
                        <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">₹{futureValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                    </div>
                </div>
                <div className="lg:w-2/3 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                             <XAxis dataKey="year" stroke="rgb(156 163 175)" />
                             <YAxis stroke="rgb(156 163 175)" tickFormatter={(value) => `₹${Number(value) / 100000}L`} />
                             <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                             <Line type="monotone" dataKey="value" name="Corpus" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};


const Goals: React.FC = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Goals & Scenarios</h1>
            <GoalPlanner />
            <ScenarioSimulator />
        </div>
    );
};

export default Goals;
