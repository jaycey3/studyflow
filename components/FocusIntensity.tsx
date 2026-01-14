import { Card } from "@heroui/react"
import { CircleChevronUp, CircleChevronDown, CircleMinus, Circle, CircleCheck } from "lucide-react"
import type { Task } from "@/lib/tasks/actions";

type FocusIntensityProps = {
    tasks: Task[];
}

type Intensity = "low" | "medium" | "high" | "none" | "completed";

function getIntensity(tasks: Task[]): { intensity: Intensity; count: number} {
    if (tasks.length === 0) return { intensity: "none", count: 0 };

    const incomplete = tasks.filter((task) => task.status !== "done");

    if (incomplete.length === 0) return { intensity: "completed", count: 0 };

    const high = incomplete.filter((task) => task.priority === "high").length;
    const medium = incomplete.filter((task) => task.priority === "medium").length;
    const low = incomplete.filter((task) => task.priority === "low").length;

    if (high > 0) return { intensity: "high", count: high };
    if (medium > 0) return { intensity: "medium", count: medium };
    return { intensity: "low", count: low };
}

export default function FocusIntensity({ tasks }: FocusIntensityProps) {
    const { intensity, count } = getIntensity(tasks);

    const config = {
        completed: {
            title: "All Done",
            sub: "All tasks completed for today",
            iconWrap: "bg-green-100",
            icon: <CircleCheck className="text-green-600" size={32} strokeWidth={2}/>,
        },
        none: {
            title: "No tasks",
            sub: "No tasks today",
            iconWrap: "bg-gray-100",
            icon: <Circle className="text-gray-600" size={32} strokeWidth={2}/>,
        },
        low: {
            title: "Low",
            sub: `${count} Low Priority task${count > 1 ? "s" : ""} today`,
            iconWrap: "bg-blue-100",
            icon: <CircleChevronDown className="text-blue-600" size={32} strokeWidth={2}/>,
        },
        medium: {
            title: "Moderate",
            sub: `${count} Medium Priority task${count > 1 ? "s" : ""} today`,
            iconWrap: "bg-amber-100",
            icon: <CircleMinus className="text-amber-600" size={32} strokeWidth={2}/>,
        },
        high: {
            title: "High",
            sub: `${count} High Priority task${count > 1 ? "s" : ""} today`,
            iconWrap: "bg-red-100",
            icon: <CircleChevronUp className="text-red-600" size={32} strokeWidth={2}/>,
        }
    } as const;
    
    const ui = config[intensity];
    
    return (
        <Card className="w-full py-6">
            <Card.Content>
                <h3 className="text-neutral-700 font-bold text-sm mb-2">Focus Intensity</h3>
                <div className="flex items-center gap-4 mb-1">
                    <div className={`rounded-2xl p-2 ${ui.iconWrap}`}>
                        {ui.icon}
                    </div>
                    <div className="w-full">
                        <h2 className="text-neutral-900 text-2xl font-bold">{ui.title}</h2>
                        <p className="text-sm text-neutral-500">{ui.sub}</p>
                    </div>
                </div>
            </Card.Content>
        </Card>
    )
}