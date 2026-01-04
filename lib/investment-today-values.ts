export const INVESTMENT_TODAY_VALUES: Record<string, { value: number; annualReturn: number }> = {
  fd: { value: 100, annualReturn: 7 }, // FD with 7% annual return
  ppf: { value: 100, annualReturn: 8.2 }, // PPF with 8.2% annual return
  mutual_fund: { value: 100, annualReturn: 12 }, // Mutual fund with 12% annual return
  stocks: { value: 100, annualReturn: 15 }, // Stocks with 15% annual return (higher risk)
  nps: { value: 100, annualReturn: 9 }, // NPS with 9% annual return
  bonds: { value: 100, annualReturn: 6.5 }, // Government bonds with 6.5% annual return
  gold: { value: 65000, annualReturn: 5 }, // Gold with 5% annual return
  crypto: { value: 105000, annualReturn: -5 }, // Bitcoin with -5% (volatile/risky)
  others: { value: 100, annualReturn: 0 }, // Default value
}

// Function to get annual return percentage for an investment type
export function getAnnualReturnPercentage(investmentType: string): number {
  const investment = INVESTMENT_TODAY_VALUES[investmentType] || INVESTMENT_TODAY_VALUES.others
  return investment.annualReturn
}

// Function to calculate today's current value based on investment type and amount
export function getTodaysCurrentValue(investmentType: string, amountInvested: number): number {
  const investment = INVESTMENT_TODAY_VALUES[investmentType] || INVESTMENT_TODAY_VALUES.others
  const baseValue = investment.value

  if (investmentType === "gold") {
    return Math.round(amountInvested * baseValue)
  } else if (investmentType === "crypto") {
    return Math.round(amountInvested)
  } else {
    return Math.round(amountInvested)
  }
}
