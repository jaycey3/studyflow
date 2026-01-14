"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type SaveNameState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export async function saveName(_prev: SaveNameState, formData: FormData): Promise<SaveNameState> {
  const supabase = await createClient();

  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userRes.user) {
    return { status: "error", message: "User not authenticated." };
  }

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { status: "error", message: "Name is required." };

  const { error } = await supabase
    .from("profiles")
    .update({ name })
    .eq("id", userRes.user.id);

  if (error) return { status: "error", message: error.message };

  redirect("/");
}
