export type Language = 'bn' | 'en';

export type ChefRule = 'equal' | 'proportional';

export type TabKey = 'main' | 'bazar' | 'dailyMeal' | 'settings';

export interface MemberRecord {
  id: string;
  name: string;
  prev: number;
  deposit: number;
  mealQty: number;
  feastCost: number;
  isChef: boolean;
  sortOrder: number;
  dailyMeals: number[];
}

export interface BazarDayRecord {
  id: string;
  day: number;
  date: string;
  cost: number;
  note: string;
}

export interface LedgerMeta {
  id: string;
  ownerId: string;
  monthBn: string;
  monthEn: string;
  chefRule: ChefRule;
  globalFeastTotal: number;
  daysCount: number;
}

export interface CalculatedMemberRow extends MemberRecord {
  total: number;
  mealRate: number;
  displayCostMeal: number;
  chefShare: number;
  totalCost: number;
  netBalance: number;
}

export interface CalculatedSummary {
  rows: CalculatedMemberRow[];
  totalPrev: number;
  totalDeposit: number;
  totalFund: number;
  totalBazar: number;
  remainedCash: number;
  totalAllMeals: number;
  mealRate: number;
  chefMeals: number;
  chefTotalCost: number;
  sumCostMeal: number;
  sumChefCost: number;
  sumFeastCost: number;
  sumTotalCost: number;
  sumNetBalance: number;
}

export interface BackupPayload {
  version: number;
  monthBn: string;
  monthEn: string;
  chefRule: ChefRule;
  globalFeastTotal: number;
  daysCount: number;
  members: MemberRecord[];
  bazar: BazarDayRecord[];
}
