import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = supabaseServer()

    // Try a lightweight query. If schema isn't deployed yet, we'll still
    // verify connectivity by accepting the "relation does not exist" error.
    const { error } = await supabase
      .from("profiles")
      .select("id", { head: true, count: "exact" })
      .limit(1)

    const connected = !error || (error && (error as any).code === "42P01")

    return NextResponse.json({ ok: true, connected, schemaExists: !error })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Unknown error" },
      { status: 500 }
    )
  }
}
