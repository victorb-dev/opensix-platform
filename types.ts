export interface BusinessProfile {
  // Section 1: Basic
  niche: string;
  products: string;
  avgTicket: number;
  monthlyRevenue: number;
  socialUrl: string;

  // Section 2: Target (Simplified for MVP)
  targetAudience?: string;
  
  // Section 3: Competition
  competitors?: string;

  // Section 4: Marketing
  adSpend?: number;

  // Section 5: Operations
  conversionRate?: number;

  // Section 6: Goals
  revenueGoal?: number;
  mainChallenge?: string;
}

export interface GamificationState {
  xp: number;
  level: number;
  badges: string[];
  streak: number;
  progress: number;
}

export interface AIAnalysisResult {
  strengths: string[];
  weaknesses: string[];
  suggestion: string;
  confidenceScore: number;
}

export interface SearchSource {
  title: string;
  uri: string;
}

export interface PredictionResult {
  predictedRevenue: number;
  confidenceScore: number;
  factors: { name: string; impact: string; positive: boolean }[];
  explanation: string;
  chartData: { day: string; value: number; upper: number; lower: number }[];
  searchSources?: SearchSource[]; // New: Google Search Sources
}

export enum AppState {
  LANDING = 'LANDING',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD'
}

export interface UserSession {
  id: string;
  email?: string;
}