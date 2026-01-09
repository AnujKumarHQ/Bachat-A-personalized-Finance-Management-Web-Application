// Currency formatting utility
export function formatCurrency(amount: number, currency: string = "INR"): string {
  const locale = getLocaleForCurrency(currency)
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCurrencyCompact(amount: number, currency: string = "INR"): string {
  const locale = getLocaleForCurrency(currency)
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    notation: "compact",
    minimumFractionDigits: 0,
  }).format(amount)
}

function getLocaleForCurrency(currency: string): string {
  switch (currency) {
    case "INR": return "en-IN"
    case "USD": return "en-US"
    case "EUR": return "de-DE"
    case "GBP": return "en-GB"
    case "JPY": return "ja-JP"
    default: return "en-US"
  }
}
