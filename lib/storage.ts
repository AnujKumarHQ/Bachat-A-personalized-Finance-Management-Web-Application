export interface Transaction {
  id: string
  type: "income" | "expense"
  category: string
  amount: number
  description: string
  date: string
}

export interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  month: string
}

export interface Investment {
  id: string
  name: string
  type: "fd" | "mutual_fund" | "stocks" | "ppf" | "gold" | "crypto" | "nps" | "bonds" | "others"
  amount: number
  currentValue: number
  expectedReturn: number
  riskLevel: "low" | "medium" | "high"
  createdAt: string
}

export interface Savings {
  id: string
  goalName: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  description: string
  createdAt: string
}

export interface MonthlyLimit {
  id: string
  month: string
  limit: number
  createdAt: string
}

const TRANSACTIONS_KEY = "pfm_transactions"
const BUDGETS_KEY = "pfm_budgets"
const INVESTMENTS_KEY = "pfm_investments"
const SAVINGS_KEY = "pfm_savings"
const MONTHLY_LIMITS_KEY = "pfm_monthly_limits"

const PREDEFINED_TRANSACTIONS: Transaction[] = [
  // Last Month (November 2024) - Recent transactions
  {
    id: "1",
    type: "income",
    category: "Salary",
    amount: 75000,
    description: "Monthly Salary",
    date: "2024-11-01",
  },
  {
    id: "2",
    type: "expense",
    category: "Food",
    amount: 4200,
    description: "Groceries and meal delivery",
    date: "2024-11-02",
  },
  {
    id: "3",
    type: "expense",
    category: "Utilities",
    amount: 2800,
    description: "Electricity and water bills",
    date: "2024-11-03",
  },
  {
    id: "4",
    type: "income",
    category: "Freelance",
    amount: 25000,
    description: "Web development project",
    date: "2024-11-05",
  },
  {
    id: "5",
    type: "expense",
    category: "Entertainment",
    amount: 3500,
    description: "Movie tickets and dining",
    date: "2024-11-06",
  },
  {
    id: "6",
    type: "expense",
    category: "Transport",
    amount: 2200,
    description: "Fuel and auto service",
    date: "2024-11-07",
  },
  {
    id: "7",
    type: "expense",
    category: "Shopping",
    amount: 6500,
    description: "Clothing and accessories",
    date: "2024-11-08",
  },
  {
    id: "8",
    type: "income",
    category: "Bonus",
    amount: 30000,
    description: "Performance bonus",
    date: "2024-11-10",
  },
  {
    id: "9",
    type: "expense",
    category: "Food",
    amount: 3800,
    description: "Restaurant dining",
    date: "2024-11-12",
  },
  {
    id: "10",
    type: "expense",
    category: "Healthcare",
    amount: 2000,
    description: "Doctor checkup and medicines",
    date: "2024-11-15",
  },
  {
    id: "11",
    type: "expense",
    category: "Entertainment",
    amount: 1500,
    description: "Gaming subscription",
    date: "2024-11-18",
  },
  {
    id: "12",
    type: "expense",
    category: "Shopping",
    amount: 4000,
    description: "Electronics and gadgets",
    date: "2024-11-20",
  },

  // Last Quarter (Aug - Oct 2024)
  {
    id: "13",
    type: "income",
    category: "Salary",
    amount: 75000,
    description: "Monthly Salary",
    date: "2024-10-01",
  },
  {
    id: "14",
    type: "expense",
    category: "Food",
    amount: 4500,
    description: "Monthly groceries",
    date: "2024-10-02",
  },
  {
    id: "15",
    type: "expense",
    category: "Utilities",
    amount: 3000,
    description: "Bills payment",
    date: "2024-10-03",
  },
  {
    id: "16",
    type: "income",
    category: "Freelance",
    amount: 20000,
    description: "Design project",
    date: "2024-10-05",
  },
  {
    id: "17",
    type: "expense",
    category: "Transport",
    amount: 2500,
    description: "Car maintenance",
    date: "2024-10-07",
  },
  {
    id: "18",
    type: "expense",
    category: "Entertainment",
    amount: 3000,
    description: "Concert tickets",
    date: "2024-10-10",
  },
  {
    id: "19",
    type: "expense",
    category: "Shopping",
    amount: 5500,
    description: "Home decor",
    date: "2024-10-15",
  },
  {
    id: "20",
    type: "income",
    category: "Bonus",
    amount: 25000,
    description: "Quarterly bonus",
    date: "2024-10-25",
  },
  {
    id: "20a",
    type: "expense",
    category: "Healthcare",
    amount: 1500,
    description: "Medical checkup",
    date: "2024-10-28",
  },

  // September 2024
  {
    id: "21",
    type: "income",
    category: "Salary",
    amount: 75000,
    description: "Monthly Salary",
    date: "2024-09-01",
  },
  {
    id: "22",
    type: "expense",
    category: "Food",
    amount: 4000,
    description: "Groceries",
    date: "2024-09-02",
  },
  {
    id: "23",
    type: "expense",
    category: "Utilities",
    amount: 2800,
    description: "Monthly bills",
    date: "2024-09-03",
  },
  {
    id: "24",
    type: "income",
    category: "Freelance",
    amount: 18000,
    description: "Content writing project",
    date: "2024-09-08",
  },
  {
    id: "25",
    type: "expense",
    category: "Healthcare",
    amount: 2500,
    description: "Dental checkup",
    date: "2024-09-10",
  },
  {
    id: "26",
    type: "expense",
    category: "Entertainment",
    amount: 2500,
    description: "Movie and dinner",
    date: "2024-09-15",
  },
  {
    id: "27",
    type: "expense",
    category: "Shopping",
    amount: 3500,
    description: "Shoes and bags",
    date: "2024-09-20",
  },
  {
    id: "28",
    type: "expense",
    category: "Transport",
    amount: 2000,
    description: "Fuel",
    date: "2024-09-25",
  },

  // August 2024
  {
    id: "29",
    type: "income",
    category: "Salary",
    amount: 75000,
    description: "Monthly Salary",
    date: "2024-08-01",
  },
  {
    id: "30",
    type: "expense",
    category: "Food",
    amount: 4300,
    description: "Monthly food expenses",
    date: "2024-08-02",
  },
  {
    id: "31",
    type: "expense",
    category: "Utilities",
    amount: 2900,
    description: "Bills",
    date: "2024-08-03",
  },
  {
    id: "32",
    type: "income",
    category: "Freelance",
    amount: 22000,
    description: "Freelance work",
    date: "2024-08-08",
  },
  {
    id: "33",
    type: "expense",
    category: "Entertainment",
    amount: 4000,
    description: "Concert and dining",
    date: "2024-08-12",
  },
  {
    id: "34",
    type: "expense",
    category: "Shopping",
    amount: 6000,
    description: "Electronics",
    date: "2024-08-18",
  },
  {
    id: "35",
    type: "expense",
    category: "Transport",
    amount: 2200,
    description: "Auto service",
    date: "2024-08-20",
  },

  // Last Year (Past months - sampling)
  {
    id: "36",
    type: "income",
    category: "Salary",
    amount: 70000,
    description: "Monthly Salary",
    date: "2024-07-01",
  },
  {
    id: "37",
    type: "expense",
    category: "Food",
    amount: 3800,
    description: "Groceries",
    date: "2024-07-05",
  },
  {
    id: "38",
    type: "expense",
    category: "Utilities",
    amount: 2700,
    description: "Bills",
    date: "2024-07-10",
  },
  {
    id: "39",
    type: "income",
    category: "Freelance",
    amount: 20000,
    description: "Project work",
    date: "2024-07-15",
  },
  {
    id: "40",
    type: "expense",
    category: "Entertainment",
    amount: 3500,
    description: "Weekend activities",
    date: "2024-07-20",
  },
  {
    id: "40a",
    type: "expense",
    category: "Shopping",
    amount: 2500,
    description: "Clothes",
    date: "2024-07-22",
  },
  {
    id: "40b",
    type: "expense",
    category: "Transport",
    amount: 1800,
    description: "Fuel",
    date: "2024-07-25",
  },

  // June 2024
  {
    id: "41",
    type: "income",
    category: "Salary",
    amount: 70000,
    description: "Monthly Salary",
    date: "2024-06-01",
  },
  {
    id: "42",
    type: "expense",
    category: "Food",
    amount: 3600,
    description: "Groceries",
    date: "2024-06-05",
  },
  {
    id: "43",
    type: "income",
    category: "Bonus",
    amount: 40000,
    description: "Half-yearly bonus",
    date: "2024-06-15",
  },
  {
    id: "44",
    type: "expense",
    category: "Shopping",
    amount: 8000,
    description: "Furniture",
    date: "2024-06-20",
  },
  {
    id: "45",
    type: "expense",
    category: "Entertainment",
    amount: 4500,
    description: "Vacation expenses",
    date: "2024-06-25",
  },
  {
    id: "45a",
    type: "expense",
    category: "Utilities",
    amount: 2600,
    description: "Monthly bills",
    date: "2024-06-10",
  },
  {
    id: "45b",
    type: "expense",
    category: "Healthcare",
    amount: 1200,
    description: "Medicines",
    date: "2024-06-18",
  },

  // May 2024
  {
    id: "46",
    type: "income",
    category: "Salary",
    amount: 70000,
    description: "Monthly Salary",
    date: "2024-05-01",
  },
  {
    id: "47",
    type: "expense",
    category: "Food",
    amount: 3700,
    description: "Groceries",
    date: "2024-05-05",
  },
  {
    id: "48",
    type: "expense",
    category: "Healthcare",
    amount: 3500,
    description: "Medical expenses",
    date: "2024-05-10",
  },
  {
    id: "49",
    type: "income",
    category: "Freelance",
    amount: 18000,
    description: "Side project",
    date: "2024-05-15",
  },
  {
    id: "50",
    type: "expense",
    category: "Transport",
    amount: 2300,
    description: "Vehicle maintenance",
    date: "2024-05-20",
  },
  {
    id: "50a",
    type: "expense",
    category: "Utilities",
    amount: 2500,
    description: "Bills",
    date: "2024-05-12",
  },
  {
    id: "50b",
    type: "expense",
    category: "Shopping",
    amount: 4200,
    description: "Accessories",
    date: "2024-05-25",
  },
]

const PREDEFINED_BUDGETS: Budget[] = [
  {
    id: "1",
    category: "Food",
    limit: 5000,
    spent: 3500,
    month: "2024-01",
  },
  {
    id: "2",
    category: "Utilities",
    limit: 3000,
    spent: 2000,
    month: "2024-01",
  },
  {
    id: "3",
    category: "Entertainment",
    limit: 5000,
    spent: 2500,
    month: "2024-01",
  },
  {
    id: "4",
    category: "Transport",
    limit: 3000,
    spent: 1500,
    month: "2024-01",
  },
]

const PREDEFINED_INVESTMENTS: Investment[] = [
  {
    id: "inv1",
    name: "Fixed Deposit (SBI)",
    type: "fd",
    amount: 100000,
    currentValue: 100000,
    expectedReturn: 7500, // 7.5% annual return (updated FD rate as per latest Nov 2024)
    riskLevel: "low",
    createdAt: new Date().toISOString(),
  },
  {
    id: "inv2",
    name: "PPF (Public Provident Fund)",
    type: "ppf",
    amount: 150000,
    currentValue: 150000,
    expectedReturn: 10650, // 7.1% annual return (official PPF rate for 2024)
    riskLevel: "low",
    createdAt: new Date().toISOString(),
  },
  {
    id: "inv3",
    name: "Mutual Fund (NIFTY 50)",
    type: "mutual_fund",
    amount: 200000,
    currentValue: 230000,
    expectedReturn: 34000, // 17.67% average annual return (2024 performance)
    riskLevel: "medium",
    createdAt: new Date().toISOString(),
  },
  {
    id: "inv4",
    name: "Government Bonds",
    type: "bonds",
    amount: 120000,
    currentValue: 120000,
    expectedReturn: 7200, // 6% annual return (GOI security bonds)
    riskLevel: "low",
    createdAt: new Date().toISOString(),
  },
  {
    id: "inv5",
    name: "National Pension System (NPS)",
    type: "nps",
    amount: 100000,
    currentValue: 110000, // 10% estimated growth
    expectedReturn: 11000, // 10-12% historical average
    riskLevel: "medium",
    createdAt: new Date().toISOString(),
  },
  {
    id: "inv6",
    name: "Gold (10 grams @ ₹7,371/gram)",
    type: "gold",
    amount: 73710, // 10 grams at current price ₹7,371 per gram (Nov 22, 2024)
    currentValue: 73710,
    expectedReturn: 2948, // 4% annual appreciation
    riskLevel: "medium",
    createdAt: new Date().toISOString(),
  },
  {
    id: "inv7",
    name: "Bitcoin (0.01 BTC)",
    type: "crypto",
    amount: 42800, // Approximate at $430 USD per 0.01 BTC (Nov 2024)
    currentValue: 42800,
    expectedReturn: 10700, // 25% historical growth rate
    riskLevel: "high",
    createdAt: new Date().toISOString(),
  },
]

const PREDEFINED_SAVINGS: Savings[] = []

export const storageUtils = {
  getTransactions: (): Transaction[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(TRANSACTIONS_KEY)
    if (!data) {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(PREDEFINED_TRANSACTIONS))
      return PREDEFINED_TRANSACTIONS
    }
    return JSON.parse(data)
  },

  addTransaction: (transaction: Omit<Transaction, "id">) => {
    const transactions = storageUtils.getTransactions()
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    }
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify([...transactions, newTransaction]))
    return newTransaction
  },

  deleteTransaction: (id: string) => {
    const transactions = storageUtils.getTransactions()
    const filtered = transactions.filter((t) => t.id !== id)
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(filtered))
  },

  getBudgets: (): Budget[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(BUDGETS_KEY)
    if (!data) {
      localStorage.setItem(BUDGETS_KEY, JSON.stringify(PREDEFINED_BUDGETS))
      return PREDEFINED_BUDGETS
    }
    return JSON.parse(data)
  },

  addBudget: (budget: Omit<Budget, "id">) => {
    const budgets = storageUtils.getBudgets()
    const newBudget = {
      ...budget,
      id: Date.now().toString(),
    }
    localStorage.setItem(BUDGETS_KEY, JSON.stringify([...budgets, newBudget]))
    return newBudget
  },

  deleteBudget: (id: string) => {
    const budgets = storageUtils.getBudgets()
    const filtered = budgets.filter((b) => b.id !== id)
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(filtered))
  },

  getInvestments: (): Investment[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(INVESTMENTS_KEY)
    if (!data) {
      localStorage.setItem(INVESTMENTS_KEY, JSON.stringify(PREDEFINED_INVESTMENTS))
      return PREDEFINED_INVESTMENTS
    }
    return JSON.parse(data)
  },

  addInvestment: (investment: Omit<Investment, "id" | "createdAt">) => {
    const investments = storageUtils.getInvestments()
    const newInvestment = {
      ...investment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem(INVESTMENTS_KEY, JSON.stringify([...investments, newInvestment]))
    return newInvestment
  },

  deleteInvestment: (id: string) => {
    const investments = storageUtils.getInvestments()
    const filtered = investments.filter((i) => i.id !== id)
    localStorage.setItem(INVESTMENTS_KEY, JSON.stringify(filtered))
  },

  getSavings: (): Savings[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(SAVINGS_KEY)
    return data ? JSON.parse(data) : []
  },

  addSavings: (savings: Omit<Savings, "id" | "createdAt">) => {
    const allSavings = storageUtils.getSavings()
    const newSavings = {
      ...savings,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem(SAVINGS_KEY, JSON.stringify([...allSavings, newSavings]))
    return newSavings
  },

  deleteSavings: (id: string) => {
    const allSavings = storageUtils.getSavings()
    const filtered = allSavings.filter((s) => s.id !== id)
    localStorage.setItem(SAVINGS_KEY, JSON.stringify(filtered))
  },

  updateSavings: (id: string, updates: Partial<Savings>) => {
    const allSavings = storageUtils.getSavings()
    const updated = allSavings.map((s) => (s.id === id ? { ...s, ...updates } : s))
    localStorage.setItem(SAVINGS_KEY, JSON.stringify(updated))
  },

  getMonthlyLimits: (): MonthlyLimit[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(MONTHLY_LIMITS_KEY)
    return data ? JSON.parse(data) : []
  },

  getMonthlyLimitForCurrentMonth: (): MonthlyLimit | null => {
    const now = new Date()
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
    const limits = storageUtils.getMonthlyLimits()
    return limits.find((l) => l.month === currentMonth) || null
  },

  setMonthlyLimit: (limit: number) => {
    const now = new Date()
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
    const limits = storageUtils.getMonthlyLimits()
    const existingIndex = limits.findIndex((l) => l.month === currentMonth)

    let updatedLimits
    if (existingIndex >= 0) {
      updatedLimits = limits.map((l, idx) => (idx === existingIndex ? { ...l, limit } : l))
    } else {
      updatedLimits = [
        ...limits,
        {
          id: Date.now().toString(),
          month: currentMonth,
          limit,
          createdAt: new Date().toISOString(),
        },
      ]
    }

    localStorage.setItem(MONTHLY_LIMITS_KEY, JSON.stringify(updatedLimits))
    return updatedLimits[updatedLimits.length - 1] || updatedLimits.find((l) => l.month === currentMonth)
  },
}
