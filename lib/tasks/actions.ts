"use server";

import { createClient } from "@/lib/supabase/server";
import { get } from "http";

export type SubmitState = 
| { status: "idle" }
| { status: "success"; message: string }
| { status: "error"; message: string };

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