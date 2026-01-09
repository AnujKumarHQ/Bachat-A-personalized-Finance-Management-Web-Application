import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { email, password, full_name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "email and password are required" },
        { status: 400 }
      )
    }

    const supabase = supabaseServer()

    // Create user via admin API (requires service role)
    const { data: userRes, error: createErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    })

    if (createErr || !userRes?.user) {
      return NextResponse.json(
        { ok: false, error: createErr?.message ?? "Failed to create user" },
        { status: 400 }
      )
    }

    const user = userRes.user

    // Insert profile row (RLS: server role bypasses; otherwise id must equal auth.uid())
    const { error: profileErr } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email,
        full_name: full_name ?? user.user_metadata?.full_name ?? null,
      },
      { onConflict: "id" }
    )

    if (profileErr) {
      return NextResponse.json(
        { ok: false, error: profileErr.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Unknown error" },
      { status: 500 }
    )
  }
}
