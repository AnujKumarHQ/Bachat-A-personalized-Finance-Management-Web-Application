<<<<<<< HEAD
// Currency formatting utility for INR
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
=======
// Currency formatting utility
export function formatCurrency(amount: number, currency: string = "INR"): string {
  const locale = getLocaleForCurrency(currency)
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

<<<<<<< HEAD
export function formatCurrencyCompact(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
=======
export function formatCurrencyCompact(amount: number, currency: string = "INR"): string {
  const locale = getLocaleForCurrency(currency)
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
    notation: "compact",
    minimumFractionDigits: 0,
  }).format(amount)
}
<<<<<<< HEAD
=======

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
>>>>>>> e84ca4ff3905f27b57c9f20969a6c56742ed1608
