export interface FinancialValues {
  revenue: number;
  rent: number;
  salaries: number;
  ads: number;
  other: number;
}

export interface CalculatedFinancials {
  totalExpenses: number;
  profit: number;
  margin: number;
  breakEven: number;
  safetyMarginPct: number;
  safetyMarginAmount: number;
  isProfitable: boolean;
  isBreakEven: boolean;
  expenseShares: {
    rentPct: number;
    salariesPct: number;
    adsPct: number;
    otherPct: number;
  };
}

export interface PresetScenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  values: FinancialValues;
}

export interface AnalysisResponse {
  success: boolean;
  input: FinancialValues;
  calculated: CalculatedFinancials;
  explanation: string;
  error?: string;
}

export interface ParsedAnalysis {
  conclusion: string;
  reason: string;
  calculation: string;
  actions: string[];
  rawText: string;
}
