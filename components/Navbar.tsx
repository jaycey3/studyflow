import { GraduationCap, CalendarCheck, NotebookPen, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { logout } from "@/app/auth/actions"

export function Navbar() {
    return (
        <div className="py-4 flex items-center justify-between w-[80%] mx-auto">
            <Link href="/" className="link text-lg gap-2 font-semibold">
                <GraduationCap size={24} strokeWidth={2} />
                StudyFlow
            </Link>
            <div className="flex items-center gap-5">
                <Link href="/" className="link gap-1">
                    <CalendarCheck size={16} strokeWidth={2} />
                    Dashboard
                </Link>
                <Link href="/reflection" className="link gap-1">
                    <NotebookPen size={16} strokeWidth={2} />
                    Reflection
                </Link>
            </div>
            <Button onClick={logout} variant="ghost" className="text-md font-semibold text-red-500 hover:bg-red-100">
                <LogOut size={16} strokeWidth={3} />
                Logout
            </Button>
        </div>
    )
}