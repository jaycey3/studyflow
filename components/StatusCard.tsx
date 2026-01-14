import { Card } from "@heroui/react"
import { CalendarCheck, CalendarX2 } from "lucide-react"
import type { Task } from "@/lib/tasks/actions";

type StatusCardProps = {
    tasks: Task[];
}

function todayKeyLocal() {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

function formatDate(yyyyMmDd: string) {
    const [year, month, day] = yyyyMmDd.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}


export default function StatusCard({ tasks }: StatusCardProps) {
    const todayKey = todayKeyLocal();

    const overdue = tasks.filter((task) => task.status !== "done" && task.due_date < todayKey);
    const overdueCount = overdue.length;

    const isOnTrack = overdueCount === 0;

    const oldestOverdueDate =
        overdueCount > 0
            ? overdue.reduce((oldest, task) =>
                task.due_date < oldest.due_date ? task : oldest
            ).due_date
            : null;

    const title = isOnTrack ? "Good Pace" : "Behind Schedule";
    const smallTitle = isOnTrack ? "On Track" : "Need Attention";
    const subText = isOnTrack
        ? "No overdue tasks"
        : `${overdueCount} overdue task${overdueCount > 1 ? "s" : ""} · ${formatDate(oldestOverdueDate!)}`;


    const iconWrap = isOnTrack ? "bg-green-100" : "bg-red-100";
    const iconColor = isOnTrack ? "text-green-600" : "text-red-600";
    const Icon = isOnTrack ? CalendarCheck : CalendarX2;


    return (
        <Card className="w-full py-6">
            <Card.Content>
                <h3 className="text-neutral-700 font-bold text-sm mb-2">{smallTitle}</h3>
                <div className="flex items-center gap-4 mb-1">
                    <div className={`${iconWrap} rounded-2xl p-2 justify-center flex`}>
                        <Icon className={iconColor} size={32} strokeWidth={2} />
                    </div>
                    <div className="w-full">
                        <h2 className="text-neutral-900 text-2xl font-bold">{title}</h2>
                        <p className="text-sm text-neutral-500">{subText}</p>
                    </div>
                </div>
            </Card.Content>
        </Card>
    )
}