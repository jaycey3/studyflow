import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    const supabase = await createClient();

    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userRes?.user) {
        return NextResponse.json({ status: "error", message: "User not authenticated." }, { status: 401 });
    }
    
    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userRes.user.id)
        .order("due_date", { ascending: true });

    if (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
}