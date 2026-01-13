"use server";

import { createClient } from "@/lib/supabase/server";

export type SubmitState = 
| { status: "idle" }
| { status: "success"; message: string }
| { status: "error"; message: string };

function addDaysToDateString(yyyyMmDd: string, daysToAdd: number) {
    const [year, month, day] = yyyyMmDd.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    date.setUTCDate(date.getUTCDate() + daysToAdd);

    const yy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(date.getUTCDate()).padStart(2, "0");

    return `${yy}-${mm}-${dd}`;
}

export async function addTask(_prevState: SubmitState, formData: FormData): Promise<SubmitState> {
    const supabase = await createClient();

    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        return { status: "error", message: "User not authenticated." };
    }

    const userId = user.data.user.id;

    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const dueDate = String(formData.get("dueDate") ?? "").trim();
    const priority = String(formData.get("priority") ?? "").trim();
    const status = String(formData.get("status") ?? "").trim();

    if (!title || !description || !dueDate || !priority || !status) {
        return { status: "error", message: "All fields are required." };
    }

    const { error } = await supabase
        .from("tasks")
        .insert([{ user_id: userId, title, description, due_date: dueDate, priority, status }]);

    if (error) {
        return { status: "error", message: error.message };
    }

    return { status: "success", message: "Task added successfully." };
}

export async function getTasksForDate(date: string) {
    const supabase = await createClient();

    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        throw new Error("User not authenticated.");
    }

    const userId = user.data.user.id;

    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .eq("due_date", date)
        .order("due_date", { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function getUpcomingTasks(fromDate: string, days = 7, limit = 5) {
    const supabase = await createClient();

    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        throw new Error("User not authenticated.");
    }

    const userId = user.data.user.id;
    
    const endDate = addDaysToDateString(fromDate, days);

    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .gte("due_date", fromDate)
        .lte("due_date", endDate)
        .order("due_date", { ascending: true })
        .limit(limit);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}