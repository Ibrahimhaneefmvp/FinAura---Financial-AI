import { FinancialData } from '../types';

// Configuration interface for API settings
interface ApiConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

// Environment variable or config for API key
const API_CONFIG: ApiConfig = {
  apiKey: process.env.FI_MCP_API_KEY || 'https://mcp.fi.money:8080/mcp/stream',
  baseUrl: process.env.FI_MCP_BASE_URL || 'https://api.fi-mcp.com',
  timeout: 10000
};

// Function to validate API key
const validateApiKey = (apiKey: string): boolean => {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Fi MCP API key is required. Please set FI_MCP_API_KEY environment variable.');
  }
  return true;
};

// Updated function with API key integration
export const fetchFinancialData = async (customApiKey?: string): Promise<FinancialData> => {
  const apiKey = customApiKey || API_CONFIG.apiKey;
  
  // Validate API key
  validateApiKey(apiKey);

  try {
    // In a real implementation, this would be an actual API call
    const response = await fetch(`${API_CONFIG.baseUrl}/financial-data`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-API-Version': '1.0'
      },
      signal: AbortSignal.timeout(API_CONFIG.timeout)
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching financial data:', error);
    
    // Fallback to mock data for development/testing
    console.log('Falling back to mock data...');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          userProfile: {
            name: 'Rohan Sharma',
            avatarUrl: `https://i.pravatar.cc/150?u=rohan_sharma`,
          },
          netWorth: 4567890,
          netWorthChange30d: 12345,
          creditScore: 780,
          monthlyCashflow: 25000,
          topInvestments: [
            { name: 'Nifty 50 Index Fund', performance: 12.5 },
          ],
          netWorthHistory: [
            { date: '2023-01-01', netWorth: 3800000 },
            { date: '2023-02-01', netWorth: 3850000 },
            { date: '2023-03-01', netWorth: 3950000 },
            { date: '2023-04-01', netWorth: 4100000 },
            { date: '2023-05-01', netWorth: 4050000 },
            { date: '2023-06-01', netWorth: 4200000 },
            { date: '2023-07-01', netWorth: 4350000 },
            { date: '2023-08-01', netWorth: 4400000 },
            { date: '2023-09-01', netWorth: 4500000 },
            { date: '2023-10-01', netWorth: 4480000 },
            { date: '2023-11-01', netWorth: 4555545 },
            { date: '2023-12-01', netWorth: 4567890 },
          ],
          assets: [
            { id: 'a1', name: 'Nifty 50 Index Fund', category: 'SIP', value: 1200000 },
            { id: 'a2', name: 'Employee Provident Fund', category: 'EPF', value: 2500000 },
            { id: 'a3', name: 'Reliance Industries', category: 'Stocks', value: 800000 },
            { id: 'a4', name: 'HDFC Savings Account', category: 'Savings', value: 567890 },
            { id: 'a5', name: 'Real Estate', category: 'Other', value: 1500000 },
          ],
          liabilities: [
            { id: 'l1', name: 'HDFC Home Loan', category: 'Home Loan', value: 2000000 },
          ],
          sips: [
            { id: 's1', name: 'Parag Parikh Flexi Cap', currentValue: 500000, roiPercentage: 15.2, benchmarkComparison: 2.1 },
            { id: 's2', name: 'Axis Small Cap', currentValue: 350000, roiPercentage: 22.8, benchmarkComparison: 5.6 },
            { id: 's3', name: 'UTI Nifty 50 Index', currentValue: 250000, roiPercentage: 11.5, benchmarkComparison: -0.5 },
          ]
        });
      }, 1000);
    });
  }
};

// Alternative function for different endpoints
export const fetchFinancialDataWithParams = async (
  endpoint: string,
  params: Record<string, any> = {},
  apiKey?: string
): Promise<any> => {
  const key = apiKey || API_CONFIG.apiKey;
  validateApiKey(key);

  const queryString = new URLSearchParams(params).toString();
  const url = `${API_CONFIG.baseUrl}/${endpoint}${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'X-API-Version': '1.0'
      },
      signal: AbortSignal.timeout(API_CONFIG.timeout)
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

