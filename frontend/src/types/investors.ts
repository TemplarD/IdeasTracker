export enum InvestmentStatus {
  PROPOSED = 'proposed',
  DISCUSSION = 'discussion',
  AGREED = 'agreed',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export interface IInvestorProfile {
  id: string;
  userId: string;
  budget?: number;
  bio?: string;
  interests?: string[];
  preferredCategories?: string[];
  totalInvestments: number;
  investedAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IInvestment {
  id: string;
  amount: number;
  sharePercent?: number;
  authorPercent?: number;
  terms?: string;
  comment?: string;
  status: InvestmentStatus;
  investorId: string;
  ideaId?: string;
  teamId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateInvestmentDto {
  amount: number;
  sharePercent?: number;
  authorPercent?: number;
  terms?: string;
  comment?: string;
  ideaId?: string;
  teamId?: string;
}

export interface ICreateInvestorProfileDto {
  budget?: number;
  bio?: string;
  interests?: string[];
  preferredCategories?: string[];
}
