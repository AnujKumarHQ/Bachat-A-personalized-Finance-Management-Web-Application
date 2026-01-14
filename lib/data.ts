import { supabaseBrowser } from "@/lib/supabase/client"

export type UITransaction = {
  id: string
  type: "income" | "expense"
  category: string
  amount: number
  description: string
  date: string
}

export type UIBudget = {
  id: string
  category: string
  limit: number
  spent: number
  month: string
}

async function getUserId(): Promise<string | null> {
  const { data } = await supabaseBrowser.auth.getUser()
  return data.user?.id ?? null
}

export async function fetchTransactions(): Promise<UITransaction[]> {
  const userId = await getUserId()
  if (!userId) return []

  const { data, error } = await supabaseBrowser
    .from("transactions")
    .select("id, amount, type, note, occurred_at, categories(name)")
    .eq("profile_id", userId)
    .order("occurred_at", { ascending: false })

  if (error || !data) return []

  return data.map((row: any) => ({
    id: String(row.id),
    type: row.type,
    category: row.categories?.name ?? "Other",
    amount: Number(row.amount),
    description: row.note ?? "",
    date: String(row.occurred_at).slice(0, 10),
  }))
}

export async function deleteTransaction(id: string) {
  const userId = await getUserId()
  if (!userId) return

  // Get transaction details first
  const { data: transaction } = await supabaseBrowser
    .from("transactions")
    .select("amount, type")
    .eq("id", id)
    .eq("profile_id", userId)
    .single()

  if (!transaction) return

  const { error } = await supabaseBrowser.from("transactions").delete().eq("id", id).eq("profile_id", userId)

  if (!error) {
    // Reverse the balance change
    const currentBalance = await fetchBalance()
    const newBalance = transaction.type === "income"
      ? currentBalance - transaction.amount
      : currentBalance + transaction.amount

    await updateBalance(newBalance)
  }
}

async function ensureCategory(name: string, type: "income" | "expense"): Promise<number | null> {
  const userId = await getUserId()
  if (!userId) return null

  const { data: found } = await supabaseBrowser
    .from("categories")
    .select("id")
    .eq("profile_id", userId)
    .eq("name", name)
    .eq("type", type)
    .maybeSingle()

  if (found?.id) return found.id as number

  const { data: created, error } = await supabaseBrowser
    .from("categories")
    .insert({ profile_id: userId, name, type })
    .select("id")
    .single()

  if (error) return null
  return created.id as number
}

export async function addTransaction(input: {
  type: "income" | "expense"
  category: string
  amount: number
  description: string
  date: string
}) {
  const userId = await getUserId()
  if (!userId) return null

  const categoryId = await ensureCategory(input.category, input.type)
  const { data, error } = await supabaseBrowser
    .from("transactions")
    .insert({
      profile_id: userId,
      amount: input.amount,
      type: input.type,
      category_id: categoryId,
      occurred_at: new Date(input.date).toISOString(),
      note: input.description,
    })
    .select("id")
    .single()
  if (error) throw new Error(error.message)

  // Update balance
  const currentBalance = await fetchBalance()
  const newBalance = input.type === "income"
    ? currentBalance + input.amount
    : currentBalance - input.amount

  await updateBalance(newBalance)

  return data
}

export async function fetchBudgets(): Promise<UIBudget[]> {
  const userId = await getUserId()
  if (!userId) return []
  const { data, error } = await supabaseBrowser
    .from("budgets")
    .select("id, category, limit_amount, month")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false })

  if (error || !data) return []

  // 'spent' is computed on the client from transactions
  return data.map((b: any) => ({ id: String(b.id), category: b.category, limit: Number(b.limit_amount), month: b.month, spent: 0 }))
}

export async function addBudget(input: { category: string; limit: number; month: string }) {
  const userId = await getUserId()
  if (!userId) return null
  const { data, error } = await supabaseBrowser
    .from("budgets")
    .insert({ profile_id: userId, category: input.category, limit_amount: input.limit, month: input.month })
    .select("id")
    .single()
  if (error) return null
  return data
}

export async function updateBudget(id: string, updates: { category?: string; limit?: number; month?: string }) {
  const userId = await getUserId()
  if (!userId) return null

  const dbUpdates: any = {}
  if (updates.category) dbUpdates.category = updates.category
  if (updates.limit !== undefined) dbUpdates.limit_amount = updates.limit
  if (updates.month) dbUpdates.month = updates.month

  const { data, error } = await supabaseBrowser
    .from("budgets")
    .update(dbUpdates)
    .eq("id", id)
    .eq("profile_id", userId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteBudget(id: string) {
  const userId = await getUserId()
  if (!userId) return
  await supabaseBrowser.from("budgets").delete().eq("id", id).eq("profile_id", userId)
}

export async function fetchBalance(): Promise<number> {
  const userId = await getUserId()
  if (!userId) return 0
  const { data } = await supabaseBrowser.from("profiles").select("balance").eq("id", userId).single()
  return Number(data?.balance ?? 0)
}

export async function updateBalance(value: number) {
  const userId = await getUserId()
  if (!userId) return null
  const { data, error } = await supabaseBrowser
    .from("profiles")
    .update({ balance: value })
    .eq("id", userId)
    .select("balance")
    .single()
  if (error) throw new Error(error.message)
  return data.balance as number
}

export type UIInvestment = {
  id: string
  name: string
  type: "fd" | "mutual_fund" | "stocks" | "ppf" | "gold" | "crypto" | "nps" | "bonds" | "others"
  amount: number
  currentValue: number
  expectedReturn: number
  riskLevel: "low" | "medium" | "high"
  createdAt: string
}

export async function fetchInvestments(): Promise<UIInvestment[]> {
  const userId = await getUserId()
  if (!userId) return []
  const { data, error } = await supabaseBrowser
    .from("investments")
    .select("*")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false })

  if (error || !data) return []

  return data.map((row: any) => ({
    id: String(row.id),
    name: row.name,
    type: row.type,
    amount: Number(row.amount),
    currentValue: Number(row.current_value),
    expectedReturn: Number(row.expected_return),
    riskLevel: row.risk_level,
    createdAt: row.created_at,
  }))
}

export async function addInvestment(input: Omit<UIInvestment, "id" | "createdAt">) {
  const userId = await getUserId()
  if (!userId) return null
  const { data, error } = await supabaseBrowser
    .from("investments")
    .insert({
      profile_id: userId,
      name: input.name,
      type: input.type,
      amount: input.amount,
      current_value: input.currentValue,
      expected_return: input.expectedReturn,
      risk_level: input.riskLevel,
    })
    .select("id")
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteInvestment(id: string) {
  const userId = await getUserId()
  if (!userId) return
  await supabaseBrowser.from("investments").delete().eq("id", id).eq("profile_id", userId)
}

export type UISavings = {
  id: string
  goalName: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  description: string
  createdAt: string
}

export async function fetchSavings(): Promise<UISavings[]> {
  const userId = await getUserId()
  if (!userId) return []
  const { data, error } = await supabaseBrowser
    .from("savings")
    .select("*")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false })

  if (error || !data) return []

  return data.map((row: any) => ({
    id: String(row.id),
    goalName: row.goal_name,
    targetAmount: Number(row.target_amount),
    currentAmount: Number(row.current_amount),
    targetDate: row.target_date,
    description: row.description,
    createdAt: row.created_at,
  }))
}

export async function addSavings(input: Omit<UISavings, "id" | "createdAt">) {
  const userId = await getUserId()
  if (!userId) return null
  const { data, error } = await supabaseBrowser
    .from("savings")
    .insert({
      profile_id: userId,
      goal_name: input.goalName,
      target_amount: input.targetAmount,
      current_amount: input.currentAmount,
      target_date: input.targetDate,
      description: input.description,
    })
    .select("id")
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteSavings(id: string) {
  const userId = await getUserId()
  if (!userId) return
  await supabaseBrowser.from("savings").delete().eq("id", id).eq("profile_id", userId)
}

export async function updateSavings(id: string, updates: Partial<UISavings>) {
  const userId = await getUserId()
  if (!userId) return

  const dbUpdates: any = {}
  if (updates.goalName) dbUpdates.goal_name = updates.goalName
  if (updates.targetAmount) dbUpdates.target_amount = updates.targetAmount
  if (updates.currentAmount) dbUpdates.current_amount = updates.currentAmount
  if (updates.targetDate) dbUpdates.target_date = updates.targetDate
  if (updates.description) dbUpdates.description = updates.description

  await supabaseBrowser.from("savings").update(dbUpdates).eq("id", id).eq("profile_id", userId)
}

export type UIMonthlyLimit = {
  id: string
  month: string
  limit: number
  createdAt: string
}

export async function fetchMonthlyLimits(): Promise<UIMonthlyLimit[]> {
  const userId = await getUserId()
  if (!userId) return []
  const { data, error } = await supabaseBrowser
    .from("monthly_limits")
    .select("*")
    .eq("profile_id", userId)
    .order("month", { ascending: false })

  if (error || !data) return []

  return data.map((row: any) => ({
    id: String(row.id),
    month: row.month,
    limit: Number(row.limit_amount),
    createdAt: row.created_at,
  }))
}

export async function setMonthlyLimit(limit: number) {
  const userId = await getUserId()
  if (!userId) return null

  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`

  const { data, error } = await supabaseBrowser
    .from("monthly_limits")
    .upsert({
      profile_id: userId,
      month: currentMonth,
      limit_amount: limit
    }, { onConflict: 'profile_id, month' })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getMonthlyLimitForCurrentMonth(): Promise<UIMonthlyLimit | null> {
  const userId = await getUserId()
  if (!userId) return null

  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`

  const { data, error } = await supabaseBrowser
    .from("monthly_limits")
    .select("*")
    .eq("profile_id", userId)
    .eq("month", currentMonth)
    .maybeSingle()

  if (error || !data) return null

  return {
    id: String(data.id),
    month: data.month,
    limit: Number(data.limit_amount),
    createdAt: data.created_at,
  }
}

export async function deleteAllData() {
  const userId = await getUserId()
  if (!userId) return

  // Delete all data for the user
  // Due to cascade delete on profiles, we might want to be careful.
  // But here we just want to clear transactions, budgets, investments, savings, etc.
  // Actually, deleting the profile would delete everything, but we want to keep the account.

  await supabaseBrowser.from("transactions").delete().eq("profile_id", userId)
  await supabaseBrowser.from("budgets").delete().eq("profile_id", userId)
  await supabaseBrowser.from("investments").delete().eq("profile_id", userId)
  await supabaseBrowser.from("savings").delete().eq("profile_id", userId)
  await supabaseBrowser.from("monthly_limits").delete().eq("profile_id", userId)
  await supabaseBrowser.from("categories").delete().eq("profile_id", userId)

  // Reset balance
  await supabaseBrowser.from("profiles").update({ balance: 0 }).eq("id", userId)
}
