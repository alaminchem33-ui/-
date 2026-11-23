import {
  BazarDayRecord,
  CalculatedMemberRow,
  CalculatedSummary,
  ChefRule,
  MemberRecord,
} from '../types/mess';

export function fmt(val: number, decimals = 2): string {
  const safe = Number.isFinite(val) ? val : 0;
  return safe.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtSmart(val: number): string {
  const safe = Number.isFinite(val) ? val : 0;
  const rounded2 = Math.round(safe * 100) / 100;
  if (Math.abs(safe - rounded2) > 0.0005) {
    return safe.toLocaleString('en-US', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });
  }
  return safe.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function calculateLedger(
  members: MemberRecord[],
  bazar: BazarDayRecord[],
  chefRule: ChefRule
): CalculatedSummary {
  const sortedMembers = [...members].sort((a, b) => a.sortOrder - b.sortOrder);

  const totalBazar = bazar.reduce((sum, b) => sum + (Number(b.cost) || 0), 0);
  const totalDeposit = sortedMembers.reduce((sum, m) => sum + (Number(m.deposit) || 0), 0);
  const totalPrev = sortedMembers.reduce((sum, m) => sum + (Number(m.prev) || 0), 0);
  const totalFund = totalPrev + totalDeposit;
  const remainedCash = totalDeposit - totalBazar;

  const totalAllMeals = sortedMembers.reduce((sum, m) => sum + (Number(m.mealQty) || 0), 0);
  const mealRate = totalAllMeals > 0 ? totalBazar / totalAllMeals : 0;

  const chefMembers = sortedMembers.filter((m) => m.isChef);
  const nonChefMembers = sortedMembers.filter((m) => !m.isChef);

  const chefMeals = chefMembers.reduce((sum, m) => sum + (Number(m.mealQty) || 0), 0);
  const chefTotalCost = chefMeals * mealRate;

  const activeNonChef = nonChefMembers.filter((m) => (Number(m.mealQty) || 0) > 0);
  const poolForChefSplit = activeNonChef.length > 0 ? activeNonChef : nonChefMembers;
  const nonChefMealsSum = poolForChefSplit.reduce((sum, m) => sum + (Number(m.mealQty) || 0), 0);

  const activeIds = new Set(poolForChefSplit.map((m) => m.id));

  let sumCostMeal = 0;
  let sumChefCost = 0;
  let sumFeastCost = 0;
  let sumTotalCost = 0;
  let sumNetBalance = 0;

  const rows: CalculatedMemberRow[] = sortedMembers.map((m) => {
    const prev = Number(m.prev) || 0;
    const deposit = Number(m.deposit) || 0;
    const mealQty = Number(m.mealQty) || 0;
    const feastCost = Number(m.feastCost) || 0;
    const total = prev + deposit;

    let displayCostMeal = 0;
    let chefShare = 0;

    if (!m.isChef) {
      displayCostMeal = mealQty * mealRate;
      if (chefTotalCost > 0 && activeIds.has(m.id)) {
        if (chefRule === 'proportional' && nonChefMealsSum > 0) {
          chefShare = chefTotalCost * (mealQty / nonChefMealsSum);
        } else if (poolForChefSplit.length > 0) {
          chefShare = chefTotalCost / poolForChefSplit.length;
        }
      }
    }

    const totalCost = displayCostMeal + chefShare + feastCost;
    const netBalance = total - totalCost;

    sumCostMeal += displayCostMeal;
    sumChefCost += chefShare;
    sumFeastCost += feastCost;
    sumTotalCost += totalCost;
    sumNetBalance += netBalance;

    return {
      ...m,
      prev,
      deposit,
      mealQty,
      feastCost,
      total,
      mealRate,
      displayCostMeal,
      chefShare,
      totalCost,
      netBalance,
    };
  });

  return {
    rows,
    totalPrev,
    totalDeposit,
    totalFund,
    totalBazar,
    remainedCash,
    totalAllMeals,
    mealRate,
    chefMeals,
    chefTotalCost,
    sumCostMeal,
    sumChefCost,
    sumFeastCost,
    sumTotalCost,
    sumNetBalance,
  };
}
