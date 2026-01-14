import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function addDaysToDateString(yyyyMmDd: string, daysToAdd: number) {
    const [year, month, day] = yyyyMmDd.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    date.setUTCDate(date.getUTCDate() + daysToAdd);

    const yy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(date.getUTCDate()).padStart(2, "0");

    return `${yy}-${mm}-${dd}`;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const fromDate = searchParams.get("fromDate");
    const days = Number(searchParams.get("days") ?? "7");
    const limit = Number(searchParams.get("limit") ?? "5");

    if (!fromDate) {
        return NextResponse.json({ error: "Missing fromDate" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userRes.user) {
        return NextResponse.json({ error: "User not authenticated." }, { status: 401 });
    }

    const startDate = addDaysToDateString(fromDate, 1);
    const endDate = addDaysToDateString(startDate, days - 1);

    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userRes.user.id)
        .gte("due_date", startDate)
        .lte("due_date", endDate)
        .order("due_date", { ascending: true })
        .limit(limit);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
}