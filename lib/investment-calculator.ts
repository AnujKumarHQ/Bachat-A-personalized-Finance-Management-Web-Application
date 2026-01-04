export interface InvestmentProjection {
  year1: number
  year5: number
  year10: number
}

export function getAnnualReturnRate(investmentType: string): number {
  // Historical average returns for Indian investments
  const returnRates: Record<string, number> = {
    fd: 0.065, // 6.5% - Fixed Deposit
    ppf: 0.075, // 7.5% - PPF
    mutual_fund: 0.12, // 12% - Mutual Funds (NIFTY average)
    stocks: 0.15, // 15% - Direct Stocks
    gold: 0.1, // 10% - Gold (historical average)
    crypto: 0.25, // 25% - Bitcoin (volatile but historically high)
    nps: 0.085, // 8.5% - NPS
    bonds: 0.065, // 6.5% - Government Bonds
    others: 0.08, // 8% - Default
  }
  return returnRates[investmentType] || returnRates.others
}

export function calculateProjectedValue(currentValue: number, annualRate: number, years: number): number {
  return Math.round(currentValue * Math.pow(1 + annualRate, years))
}

export function getProjections(currentValue: number, investmentType: string): InvestmentProjection {
  const rate = getAnnualReturnRate(investmentType)
  return {
    year1: calculateProjectedValue(currentValue, rate, 1),
    year5: calculateProjectedValue(currentValue, rate, 5),
    year10: calculateProjectedValue(currentValue, rate, 10),
  }
}
