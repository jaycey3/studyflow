import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userRes.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", userRes.user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ name: data?.name ?? null });
}
