"use server";

import { createClient } from "@/lib/supabase/server";

export type SubmitState = 
| { status: "idle" }
| { status: "success"; message: string; task?: Task; deletedId?: number }
| { status: "error"; message: string };

export type Task = {
    id: number;
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    status: "todo" | "doing" | "done";
    due_date: string;
    user_id: string;
}

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

    const { data, error } = await supabase
        .from("tasks")
        .insert([{ user_id: userId, title, description, due_date: dueDate, priority, status }])
        .select("*")
        .single();

    if (error) {
        return { status: "error", message: error.message };
    }

    return { status: "success", message: "Task added successfully.", task: data as Task };
}

export async function updateTask(_prevState: SubmitState, formData: FormData): Promise<SubmitState> {
    const supabase = await createClient();

    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        return { status: "error", message: "User not authenticated." };
    }

    const userId = user.data.user.id;

    const id = Number(formData.get("id") ?? 0);

    if (!id) return { status: "error", message: "Invalid task ID." };

    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const dueDate = String(formData.get("dueDate") ?? "").trim();
    const priority = String(formData.get("priority") ?? "").trim();
    const status = String(formData.get("status") ?? "").trim();

    if (!title || !description || !dueDate || !priority || !status) {
        return { status: "error", message: "All fields are required." };
    }

    const { data, error } = await supabase
        .from("tasks")
        .update({ title, description, due_date: dueDate, priority, status })
        .eq("id", id)
        .eq("user_id", userId)
        .select("*")
        .single();

    if (error) {
        return { status: "error", message: error.message };
    }

    return { status: "success", message: "Task updated successfully.", task: data as Task };
}

export async function deleteTask(_prevState: SubmitState, formData: FormData): Promise<SubmitState> {
    const supabase = await createClient();

    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        return { status: "error", message: "User not authenticated." };
    }

    const userId = user.data.user.id;

    const id = Number(formData.get("id") ?? 0);
    if (!id) {
        return { status: "error", message: "Invalid task ID." };
    }

    const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

    if (error) {
        return { status: "error", message: error.message };
    }

    return { status: "success", message: "Task deleted successfully.", deletedId: id };
}

export async function updateTaskStatus(_prev: SubmitState, formData: FormData): Promise<SubmitState> {
    const supabase = await createClient();

    const { data: userRes } = await supabase.auth.getUser();
    if (!userRes?.user) {
        return { status: "error", message: "User not authenticated." };
    }

    const userId = userRes.user.id;
    const id = Number(formData.get("id") ?? 0);
    const status = String(formData.get("status") ?? "").trim() as Task["status"];

    if (!id) return { status: "error", message: "Invalid task ID." };
    if (!["todo", "doing", "done"].includes(status)) {
        return { status: "error", message: "Invalid status value." };
    }

    const { data, error } = await supabase
        .from("tasks")
        .update({ status })
        .eq("id", id)
        .eq("user_id", userId)
        .select("*")
        .single();

    if (error) {
        return { status: "error", message: error.message };
    }

    if (!data) return { status: "error", message: "Task not found." };

    return { status: "success", message: "Task status updated successfully.", task: data as Task };
}

export async function updateTaskPriority(_prev: SubmitState, formData: FormData): Promise<SubmitState> {
    const supabase = await createClient();

    const { data: userRes } = await supabase.auth.getUser();
    if (!userRes.user) {
        return { status: "error", message: "User not authenticated." };
    }

    const userId = userRes.user.id;
    const id = Number(formData.get("id") ?? 0);
    const priority = String(formData.get("priority") ?? "").trim() as Task["priority"];

    if (!id) return { status: "error", message: "Invalid task ID." };
    if (!["low", "medium", "high"].includes(priority)) {
        return { status: "error", message: "Invalid priority value." };
    }

    const { data, error } = await supabase
        .from("tasks")
        .update({ priority })
        .eq("id", id)
        .eq("user_id", userId)
        .select("*")
        .single();

    if (error) {
        return { status: "error", message: error.message };
    }

    if (!data) return { status: "error", message: "Task not found." };

    return { status: "success", message: "Task priority updated successfully.", task: data as Task };
}