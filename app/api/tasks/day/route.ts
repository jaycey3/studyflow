import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
        return NextResponse.json({ error: "Missing date" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userRes.user) {
        return NextResponse.json({ error: "User not authenticated." }, { status: 401 });
    }

    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userRes.user.id)
        .eq("due_date", date)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
}