import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "email and password are required" },
        { status: 400 }
      )
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

    if (!url || !anon) {
      return NextResponse.json(
        { ok: false, error: "Supabase env vars missing" },
        { status: 500 }
      )
    }

    const supabase = createClient(url, anon)

    const { data: signIn, error: signInErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInErr || !signIn?.user || !signIn.session) {
      return NextResponse.json(
        { ok: false, error: signInErr?.message ?? "Invalid credentials" },
        { status: 401 }
      )
    }

    // Ensure a profile exists for this user (id must equal auth.uid() due to RLS)
    // Use the session access token in a new client to perform the upsert as the user
    const authed = createClient(url, anon, {
      global: { headers: { Authorization: `Bearer ${signIn.session.access_token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const { error: upsertErr } = await authed.from("profiles").upsert(
      {
        id: signIn.user.id,
        email: signIn.user.email,
        full_name: (signIn.user.user_metadata as any)?.full_name ?? null,
      },
      { onConflict: "id" }
    )

    if (upsertErr) {
      // Non-fatal: continue to return session, but include warning
      return NextResponse.json({
        ok: true,
        user: { id: signIn.user.id, email: signIn.user.email },
        session: signIn.session,
        warning: `Profile upsert failed: ${upsertErr.message}`,
      })
    }

    return NextResponse.json({
      ok: true,
      user: { id: signIn.user.id, email: signIn.user.email },
      session: signIn.session,
    })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Unknown error" },
      { status: 500 }
    )
  }
}
