
export type ViewType = 'dashboard' | 'chat' | 'net-worth' | 'investments' | 'loans' | 'goals' | 'settings';

export interface NavItem {
  id: ViewType;
  label: string;
  icon: (props: { className?: string }) => React.ReactNode;
}

export interface UserProfile {
  name: string;
  avatarUrl: string;
}

export interface Asset {
  id: string;
  name: string;
  category: 'SIP' | 'EPF' | 'Stocks' | 'Savings' | 'Other';
  value: number;
}

export interface Liability {
  id: string;
  name: string;
  category: 'Home Loan' | 'Car Loan' | 'Credit Card' | 'Personal Loan';
  value: number;
}

export interface NetWorthHistory {
  date: string;
  netWorth: number;
}

export interface SIP {
  id: string;
  name:string;
  currentValue: number;
  roiPercentage: number;
  benchmarkComparison: number;
}

export interface FinancialData {
  userProfile: UserProfile;
  netWorth: number;
  netWorthChange30d: number;
  creditScore: number;
  monthlyCashflow: number;
  topInvestments: { name: string; performance: number }[];
  netWorthHistory: NetWorthHistory[];
  assets: Asset[];
  liabilities: Liability[];
  sips: SIP[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}
