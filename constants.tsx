
import React from 'react';
import { NavItem, ViewType } from './types';
import { ChartPieIcon, ChatBubbleLeftRightIcon, HomeIcon, PresentationChartLineIcon, BuildingLibraryIcon, RocketLaunchIcon, Cog6ToothIcon } from './components/icons/index';

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
  { id: 'chat', label: 'Chat Assistant', icon: ChatBubbleLeftRightIcon },
  { id: 'net-worth', label: 'Net Worth', icon: ChartPieIcon },
  { id: 'investments', label: 'Investments', icon: PresentationChartLineIcon },
  { id: 'loans', label: 'Loans & Liabilities', icon: BuildingLibraryIcon },
  { id: 'goals', label: 'Goals & Scenarios', icon: RocketLaunchIcon },
  { id: 'settings', label: 'Settings', icon: Cog6ToothIcon },
];

export const SUGGESTED_PROMPTS: string[] = [
    "How is my net worth growing?",
    "Can I afford a ₹50L home loan?",
    "Which SIPs underperformed the market?",
    "Simulate my retirement savings if I invest ₹10,000 more per month.",
];
