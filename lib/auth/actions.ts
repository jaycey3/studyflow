"use server"

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type SendEmailState = 
| { status: "idle" }
| { status: "success"; message: string }
| { status: "error"; message: string };

export type LoginState = 
| null
| { status: "success"; message: string }
| { status: "error"; message: string };

export async function sendEmail(_prevState: SendEmailState, formData: FormData): Promise<SendEmailState> {
    const supabase = await createClient()

    const email = String(formData.get("email") ?? "").trim();

    if (!email) {
        return { status: "error", message: "Email is required." };
    }

    const { error } = await supabase.auth.signInWithOtp({ email: email })

    if (error) {
        return { status: "error", message: error.message };
    }

    return { status: "success", message: "Successfully sent OTP to your email." };
}

export async function login(_prevState: LoginState, formData: FormData ): Promise<LoginState> {
    const supabase = await createClient()

    const otp = String(formData.get("otp") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

    if (!otp || !email) {
        throw new Error("Missing OTP or email.");
    }

    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email"
    })

    if (error || !data.session) {
        return { status: "error", message: error?.message || "Failed to verify OTP." };
    }

    const userId = data.session.user.id;

    await supabase.from("profiles").upsert({ id: userId }, { onConflict: "id" });

    const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", userId)
    .single();

    if (profileErr) {
        return { status: "error", message: profileErr.message };
    }

    if (!profile?.name || profile.name.trim() === "") {
        redirect("/onboarding");
    }

    redirect("/");
}

export async function logout() {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut();

    if (error) {
        throw new Error(error.message);
    }

    redirect("/auth");
}